const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const { BadRequest } = require("../helpers/error.constructors");

const validateID = (req, res, next) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    throw new BadRequest("Invalid ID value");
  }
  next();
};

const contactValidationSchema = () => {
  const name = Joi.string().min(3).max(30);
  const email = Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: true },
  });
  const phone = Joi.string().pattern(
    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
  );
  const subscription = Joi.string().valid("free", "pro", "premium");
  const password = Joi.string();
  const token = Joi.string();
  return {
    name,
    email,
    phone,
    subscription,
    password,
    token,
  };
};

const validateCreateContact = (req, res, next) => {
  const baseSchema = contactValidationSchema();
  const schema = Joi.object({
    ...baseSchema,
    name: baseSchema.name.required(),
    email: baseSchema.email.required(),
    phone: baseSchema.phone.required(),
  });

  const validationResult = schema.validate(req.body, { abortEarly: false });

  if (validationResult.error) {
    throw new BadRequest(validationResult.error.message);
  }

  next();
};

const validateUpdateContact = (req, res, next) => {
  const baseSchema = contactValidationSchema();
  const schema = Joi.object({
    ...baseSchema,
  });

  const validationResult = schema.validate(req.body, { abortEarly: false });

  if (validationResult.error) {
    throw new BadRequest(validationResult.error.message);
  }

  next();
};

module.exports = {
  validateID,
  validateCreateContact,
  validateUpdateContact,
};
