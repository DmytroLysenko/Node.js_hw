const fsPromises = require("fs").promises;
const User = require("../users/user.model");
const {
  NotAuthorized,
  LoginOccupied,
} = require("../helpers/error.constructors");

const IMAGES_SOURCE = process.env.IMAGES_SOURCE;
const DEFAULT_AVATAR_FILENAME = process.env.DEFAULT_AVATAR_FILENAME;

async function registerUser(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
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

    console.log(avatarOptions);

    const newUser = await User.create({
      ...req.body,
      password: passwordHash,
      ...avatarOptions,
    });

    const response = {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    };

    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotAuthorized("Email or password is wrong");
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
      throw new NotAuthorized("Email or password is wrong");
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
};
