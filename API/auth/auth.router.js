const { Router } = require("express");
const authControllers = require("./auth.controllers");
const authMiddlewares = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/multer");
const avatar = require("../middlewares/avatarMiddlewares")

const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  authMiddlewares.validateAuthData,
  avatar.validateAvatar,
  avatar.minimizeAndSaveAvatar,
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
