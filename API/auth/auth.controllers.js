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

    const passwordHash = await User.makeHashPassword(req.body.password);

    const newUser = await User.create({
      ...req.body,
      password: passwordHash,
    });

    const responseData = {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    };

    return res.status(201).json(responseData);
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

    if (await user.isPasswordInvalid(password, user.password)) {
      throw new NotAuthorized("Email or password is wrong");
    }

    const loggingUser = await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          token: user.makeToken({ id: user.id }),
        },
      },
      {
        new: true,
      }
    );

    const responseData = {
      token: loggingUser.token,
      user: {
        email: loggingUser.email,
        subscription: loggingUser.subscription,
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
}

async function logoutUser(req, res, next) {
  try {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          token: null,
        },
      },
      {
        new: true,
      }
    );
    if (!user) {
      throw new NotAuthorized("Not authorized");
    }
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
