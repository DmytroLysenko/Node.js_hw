const Joi = require("joi");
const { BadRequest } = require("../helpers/error.constructors");

function validateUpdateUser(req, res, next) {
  const validateSchema = Joi.object({
    subscription: Joi.string().valid("free", "pro", "premium").required(),
  });

  const validateResult = validateSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validateResult.error) {
    throw new BadRequest(validateResult.error.message);
  }
  next();
}

module.exports = {
  validateUpdateUser,
};
