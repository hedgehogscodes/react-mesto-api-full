const usersRouter = require("express").Router();
const { celebrate, CelebrateError, Joi } = require("celebrate");
const validator = require("validator");

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

const validateUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .custom((url) => {
        if (!validator.isURL(url)) {
          throw new CelebrateError("Неверный URL");
        }
        return url;
      }),
  }),
});

usersRouter.get("/", getUsers);
usersRouter.get("/me", getUser);
usersRouter.get("/:_id", validateUserId, getUserById);
usersRouter.patch("/me", validateUserUpdate, updateUser);
usersRouter.patch("/me/avatar", validateUserAvatar, updateAvatar);

module.exports = usersRouter;
