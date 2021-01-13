const { Router } = require("express");
const userControllers = require("./user.controllers");
const authMiddlewares = require("../middlewares/authMiddlewares");
const userMiddlewares = require("../middlewares/userMiddlewares");

const userRouter = new Router();

userRouter.get(
  "/current",
  authMiddlewares.isAuthorized,
  userControllers.currentUser
);

userRouter.patch(
  "/",
  authMiddlewares.isAuthorized,
  userMiddlewares.validateUpdateUser,
  userControllers.updateUser
);

module.exports = userRouter;
