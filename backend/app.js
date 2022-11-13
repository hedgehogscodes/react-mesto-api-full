const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors, celebrate, Joi } = require("celebrate");
const helmet = require("helmet");
const NotFoundError = require("./utils/NotFoundError");
const cors = require("cors");
require("dotenv").config();

const REGEX_URL = require("./utils/regexps");
const requestLimiter = require("./middlewares/limiter");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3000 } = process.env;
const app = express();

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(requestLimiter);
app.use(helmet());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.post("/signin", validateUser, login);
app.post("/signup", validateUser, createUser);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("/*", () => {
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error in server setup");
  } else {
    console.log(`Server listening on port ${PORT}`);
  }
});
