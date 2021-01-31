const fsPromises = require("fs").promises;
const User = require("../users/user.model");
const mailer = require("../helpers/mailer");
const uuid = require("uuid");
const {
  NotAuthorized,
  LoginOccupied,
  NotFound,
} = require("../helpers/error.constructors");

const IMAGES_SOURCE = process.env.IMAGES_SOURCE;
const DEFAULT_AVATAR_FILENAME = process.env.DEFAULT_AVATAR_FILENAME;

async function registerUser(req, res, next) {
  try {
    const user = await User.getUserByEmail(req.body.email);
    if (user) {
      if (req.file) {
        await fsPromises.unlink(req.file.path);
      }
      throw new LoginOccupied("Email in use");
    }

    const passwordHash = await User.makePasswordHash(req.body.password);

    const avatarOptions = req.file
      ? {
          avatarURL: `${IMAGES_SOURCE}/${req.file.filename}`,
          avatarFilename: req.file.filename,
        }
      : {};

    const newUser = await User.create({
      ...req.body,
      password: passwordHash,
      ...avatarOptions,
      verificationToken: uuid.v4(),
    });

    await mailer.sendVerificationEmail(
      newUser.email,
      newUser.verificationToken
    );

    return res.status(201).send("Check your email and verify it please!");
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.getUserByEmail(email);

    if (!user) {
      throw new NotAuthorized("Email or password is wrong");
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
      throw new NotAuthorized("Email or password is wrong");
    }

    if (
      user.verificationToken === "undefined" ||
      user.verificationToken !== null
    ) {
      const verificationToken = await user.updateVerificationToken(uuid.v4());
      await mailer.sendVerificationEmail(email, verificationToken);
      throw new NotAuthorized("Check your email and verify it please");
    }

    const loggedUser = await user.generateAndSaveToken();

    const avatarURL = loggedUser.avatarURL
      ? loggedUser.avatarURL
      : `${IMAGES_SOURCE}/${DEFAULT_AVATAR_FILENAME}`;

    const response = {
      token: loggedUser.token,
      user: {
        email: loggedUser.email,
        subscription: loggedUser.subscription,
        avatarURL,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

async function verifyUserEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const user = await User.getUserByVerificationToken(verificationToken);
    if (!user) {
      throw new NotFound("User not found");
    }
    await user.updateVerificationToken(null);

    res.status(200).send("Email verified!");
  } catch (err) {
    next(err);
  }
}

async function logoutUser(req, res, next) {
  try {
    const user = req.user;
    await user.deleteToken();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyUserEmail,
};
