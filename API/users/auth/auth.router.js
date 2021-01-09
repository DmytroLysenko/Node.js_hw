const { Router } = require("express");
const authControllers = require("./auth.controllers");

const authRouter = Router();

authRouter.post(
  "/register",
  authControllers.validateAuthData,
  authControllers.registerUser
);

authRouter.post(
  "/login",
  authControllers.validateAuthData,
  authControllers.loginUser
);

authRouter.post(
  "/logout",
  authControllers.isAuthorized,
  authControllers.logoutUser
);

module.exports = authRouter;
