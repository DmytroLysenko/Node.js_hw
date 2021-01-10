const { Router } = require("express");
const userControllers = require("./user.controllers");
const authControllers = require("./auth/auth.controllers");

const userRouter = new Router();

userRouter.get(
  "/current",
  authControllers.isAuthorized,
  userControllers.currentUser
);

userRouter.patch(
  "/",
  authControllers.isAuthorized,
  userControllers.validateUpdateUser,
  userControllers.updateUser
);

module.exports = userRouter;
