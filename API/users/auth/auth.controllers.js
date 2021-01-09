const userModel = require("../user.model");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  BadRequest,
  NotAuthorized,
  LoginOccupied,
} = require("../../helpers/error.constructors");
const JWT_SECRET = process.env.JWT_SECRET;
const costFactor = Number(process.env.BCRYPT_COST_FACTOR);

async function registerUser(req, res, next) {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      throw new LoginOccupied("Email in use");
    }
    const passwordHash = await bcrypt.hash(req.body.password, costFactor);
    const newUser = await userModel.create({
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

    const user = await userModel.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      throw new NotAuthorized("Email or password is wrong");
    }

    const token = makeToken(user.id);

    const loggingUser = await userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          token,
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
    const { email } = req.user;
    const user = await userModel.findOneAndUpdate(
      { email },
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

async function isAuthorized(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new NotAuthorized("Not authorized");
    }
    const token = authHeader.replace("Bearer ", "");
    const id = jwt.verify(token, JWT_SECRET).id;
    const user = await userModel.findById(id);

    if (!user) {
      throw new NotAuthorized("Not authorized");
    }

    req.user = user;

    next();
  } catch {
    next(new NotAuthorized("Not authorized"));
  }
}

function validateAuthData(req, res, next) {
  const authDataSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true },
      })
      .required(),
    password: Joi.string().min(5).max(20).required(),
    subscription: Joi.string().valid("free", "pro", "premium"),
  });

  const validationResult = authDataSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationResult.error) {
    throw new BadRequest(validationResult.error.message);
  }

  next();
}

function makeToken(id) {
  return jwt.sign({ id }, JWT_SECRET);
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  isAuthorized,
  validateAuthData,
};
