const Joi = require("joi");
const path = require("path");

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

    const isTokenEqual = user.isTokenEqual(token);

    if (!isTokenEqual) {
      throw new NotAuthorized("Not authorized");
    }

    req.user = user;

    next();
  } catch {
    next(new NotAuthorized("Not authorized"));
  }
}

async function validateAuthData(req, res, next) {
  try {
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
      if (req.file) {
        await fsPromises.unlink(req.file.path);
      }

      throw new BadRequest(validationResult.error.message);
    }

    next();
  } catch (err) {
    next(err);
  }
}

async function validateAvatar(req, res, next) {
  try {
    if (!req.file) {
      return next();
    }

    const ext = path.extname(req.file.originalname);
    const size = req.file.size;

    if (ext !== ".jpg" && ext !== ".png") {
      await fsPromises.unlink(req.file.path);
      throw new BadRequest('File extension must be "jpg" or "png"');
    }
    if (size > 8e7) {
      await fsPromises.unlink(req.file.path);
      throw new BadRequest("File size must be less than 10M");
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  isAuthorized,
  validateAuthData,
  validateAvatar,
};
