const Joi = require("joi");
const User = require("../users/user.model");
const { NotAuthorized, BadRequest } = require("../helpers/error.constructors");

async function isAuthorized(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new NotAuthorized("Not authorized");
    }

    const [type, token] = authHeader.split(" ");

    const payload = User.getPayloadFromToken(token);

    if (!payload) {
      throw new NotAuthorized("Not authorized");
    }

    const user = await User.findById(payload.id);

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

module.exports = {
  isAuthorized,
  validateAuthData,
};
