const Joi = require("joi");

const validateAddContact = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: true },
      })
      .required(),
    phone: Joi.string()
      .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
      .required(),
  });

  const validationError = schema.validate(req.body).error;

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  next();
};

const validateEditContact = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: true },
    }),
    phone: Joi.string().pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
  });

  const validationError = schema.validate(req.body).error;
  const id = parseInt(req.params.id);

  if (validationError) {
    return res.status(400).json({ message: validationError });
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
