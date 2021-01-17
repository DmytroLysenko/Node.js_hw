const { Router } = require("express");
const authControllers = require("./auth.controllers");
const authMiddlewares = require("../middlewares/authMiddlewares");

const authRouter = Router();

authRouter.post(
  "/register",
  authMiddlewares.validateAuthData,
  authControllers.registerUser
);

authRouter.post(
  "/login",
  authMiddlewares.validateAuthData,
  authControllers.loginUser
);

authRouter.post(
  "/logout",
  authMiddlewares.isAuthorized,
  authControllers.logoutUser
);

module.exports = authRouter;
