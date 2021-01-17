const User = require("../users/user.model");
const {
  NotAuthorized,
  LoginOccupied,
} = require("../helpers/error.constructors");

async function registerUser(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new LoginOccupied("Email in use");
    }

    const passwordHash = await User.makePasswordHash(req.body.password);

    const newUser = await User.create({
      ...req.body,
      password: passwordHash,
    });

    const response = {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
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

    const response = {
      token: loggedUser.token,
      user: {
        email: loggedUser.email,
        subscription: loggedUser.subscription,
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
