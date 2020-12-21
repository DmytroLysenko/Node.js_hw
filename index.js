const express = require("express");
const cors = require("cors");
const app = express();
const config = require("dotenv").config();
const morgan = require("morgan");
const Joi = require("joi");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  editContact,
} = require("./contacts");

const port = process.env.PORT || 80;

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

// Get all contacts
app.get("/api/contacts", async (_, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts });
  } catch (err) {
    handleError(err, res);
  }
});

// Get contact by id
app.get("/api/contacts/:contactId", async (req, res, next) => {
  try {
    const id = parseInt(req.params.contactId);

    if (!id) {
      res.status(400).json({ message: "invalid id value!" });
      return;
    }

    const contact = await getContactById(id);

    return contact
      ? res.status(200).json({ contact })
      : res.status(404).json({ message: `contact with id: ${id} not found` });
  } catch (err) {
    handleError(err, res);
  }
});

// Remove contact by id
app.delete("/api/contacts/:contactId", async (req, res, next) => {
  try {
    const id = parseInt(req.params.contactId);

    if (!id) {
      return res.status(400).json({ message: "invalid id value!" });
    }

    const passed = await removeContact(id);

    return passed
      ? res.status(200).json({ message: `contact with id:${id} was deleted` })
      : res.status(404).json({ message: `contact with id:${id} not found` });
  } catch (err) {
    handleError(err, res);
  }
});

// Add new contact
app.post(
  "/api/contacts",
  (req, res, next) => {
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
  },
  async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;

      const contact = await addContact({ name, email, phone });

      return contact
        ? res.status(201).json({ contact })
        : res.status(400).json({ message: `${name} is already present` });
    } catch (err) {
      handleError(err, res);
    }
  }
);

// Edit contact
app.patch(
  "/api/contacts/:contactId",
  (req, res, next) => {
    const schema = Joi.object().keys({
      name: Joi.string().alphanum().min(3).max(30),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: true },
      }),
      phone: Joi.string().pattern(
        /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
      ),
    });

    const validationError = schema.validate(req.body).error;
    const id = parseInt(req.params.contactId);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (!id) {
      return res.status(400).json({ message: "invalid id value" });
    }

    next();
  },
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.contactId);
      const contactData = req.body;

      const contact = await editContact(id, contactData);

      return contact
        ? res.status(200).json({ contact })
        : res.status(404).json({ message: `contact with id:${id} not found` });
    } catch (err) {
      handleError(err, res);
    }
  }
);

app.listen(port, () => console.warn(`\x1B[34m Listening on port: ${port}!`));

function handleError(err, res) {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong. Please, try again later...",
  });
}
