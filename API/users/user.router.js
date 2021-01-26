const { Router } = require("express");
const upload = require("../middlewares/multer");
const userControllers = require("./user.controllers");
const authMiddlewares = require("../middlewares/authMiddlewares");
const userMiddlewares = require("../middlewares/userMiddlewares");

const userRouter = new Router();

userRouter.get(
  "/current",
  authMiddlewares.isAuthorized,
  userControllers.currentUser
);

userRouter.get(
  "/current/with-contacts",
  authMiddlewares.isAuthorized,
  userControllers.currentUserWithContacts
);

userRouter.patch(
  "/",
  authMiddlewares.isAuthorized,
  userMiddlewares.validateUpdateUserSub,
  userControllers.updateUserSub
);

userRouter.patch(
  "/avatars",
  authMiddlewares.isAuthorized,
  upload.single("avatar"),
  authMiddlewares.validateAvatar,
  authMiddlewares.minimizeAndSaveAvatar,
  userControllers.updateUserAvatar
);

module.exports = userRouter;
