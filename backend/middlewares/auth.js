const jwt = require("jsonwebtoken");
const UnauthError = require("../utils/UnauthError");

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthError("Необходимо авторизироваться"));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === "production" ? JWT_SECRET : "dev-secret"}`,
    );
  } catch (err) {
    next(new UnauthError("Необходимо авторизироваться"));
  }

  req.user = payload;

  return next();
};
