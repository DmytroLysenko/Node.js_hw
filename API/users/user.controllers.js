const userModel = require("./user.model");
const Joi = require("joi");
const { BadRequest } = require("../helpers/error.constructors");

function currentUser(req, res, next) {
  const user = {
    email: req.user.email,
    subscription: req.user.subscription,
  };
  res.status(200).json(user);
}

async function updateUser(req, res, next) {
  try {
    const { subscription } = req.body;
    if (subscription === req.user.subscription) {
      return res.status(200).send();
    }

    const { id } = req.user;
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          subscription,
        },
      },
      { new: true }
    );
    return res.status(200).send();
  } catch (err) {
    next(err);
  }
}

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
  currentUser,
  updateUser,
  validateUpdateUser,
};
