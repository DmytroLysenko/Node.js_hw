const contactModel = require("./contact.model");
const { isValidObjectId } = require("mongoose");
const Joi = require("joi");
const { BadRequest } = require("../helpers/error.constructors");

const createContact = async (req, res, next) => {
  try {
    const contactData = req.body;
    const contact = await contactModel.create(contactData);
    res.status(201).json(contact);
  } catch (err) {
    const code = err.code;
    if (code === 11000 || code === 11001) {
      next(new BadRequest(err.message));
    }
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contactData = req.body;
    const contact = await contactModel.findByIdAndUpdate(
      id,
      {
        $set: { ...contactData },
      },
      { new: true }
    );
    contact
      ? res.status(200).json(contact)
      : res.status(404).send(`No contact with ID: ${id}`);
  } catch (err) {
    const code = err.code;
    if (code === 11000 || code === 11001) {
      next(new BadRequest(err.message));
    }
    next(err);
  }
};

const getContacts = async (req, res, next) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const contacts = await contactModel.find();
      return res.status(200).json(contacts);
    }

    const { sub } = req.query;

    const query = sub ? { subscription: sub } : {};

    const options = {
      // select: ["name", "email", "phone", "subscription"],
      ...req.query,
    };

    const result = await contactModel.paginate(query, options);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await contactModel.findById(id);
    contact
      ? res.status(200).json(contact)
      : res.status(404).send(`No contact with ID: ${id}`);
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await contactModel.findByIdAndDelete(id);
    contact
      ? res.status(200).send(`Contact with ID: ${id} has been deleted`)
      : res.status(404).send(`No contact with ID: ${id}`);
  } catch (err) {
    next(err);
  }
};

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
  const {
    name,
    email,
    phone,
    subscription,
    password,
    token,
  } = contactValidationSchema();
  const schema = Joi.object({
    name: name.required(),
    email: email.required(),
    phone,
    subscription,
    password: password.required(),
    token,
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
  createContact,
  updateContact,
  getContacts,
  getContactById,
  deleteContact,
  validateID,
  validateCreateContact,
  validateUpdateContact,
};
