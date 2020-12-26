const Joi = require("joi");

const nameSchema = Joi.string().alphanum().min(3).max(30);
const emailSchema = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: true },
});
const phoneSchema = Joi.string().pattern(
  /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
);

const validateAddContact = (req, res, next) => {
  const schema = Joi.object({
    name: nameSchema.required(),
    email: emailSchema.required(),
    phone: phoneSchema.required(),
  });

  const validationResult = schema.validate(req.body, { abortEarly: false });

  if (validationResult.error) {
    return res.status(400).send({ message: validationResult.error.message });
  }

  next();
};

const validateEditContact = (req, res, next) => {
  const schema = Joi.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
  });

  const validationResult = schema.validate(req.body, { abortEarly: false });
  const id = parseInt(req.params.id);

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.message });
  }

  if (!id) {
    return res.status(400).json({ message: "invalid id value" });
  }

  next();
};

module.exports = {
  validateAddContact,
  validateEditContact,
};
