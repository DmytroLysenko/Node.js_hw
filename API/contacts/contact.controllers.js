const {
  Types: { ObjectId },
} = require("mongoose");
const { BadRequest, NotFound } = require("../helpers/error.constructors");

const createContact = async (req, res, next) => {
  try {
    const user = req.user;
    const contactData = req.body;

    const isContactExist = await user.isContactExist(contactData);

    if (isContactExist) {
      throw new BadRequest("Contact with same data is already exists");
    }

    const contact = await user.addContact(contactData);

    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contactId = ObjectId(req.params.id);
    const contactData = req.body;
    const user = req.user;

    const isContactExist = await user.isContactExist(contactData);

    if (isContactExist) {
      throw new BadRequest("Contact with same data is already exists");
    }

    const contact = await user.updateContact(contactId, contactData);

    contact
      ? res.status(200).json(contact)
      : res.status(404).send(`No contact with ID: ${id}`);
  } catch (err) {
    next(err);
  }
};

const getContacts = async (req, res, next) => {
  try {
    if (!req.query.page) {
      const contacts = await req.user.getContacts();
      return res.status(200).json(contacts);
    }

    const options = {
      ...req.query,
    };

    const contacts = await req.user.getContactsWithPagination(options);

    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contactId = ObjectId(req.params.id);

    const contact = await req.user.getContactById(contactId);

    if (!contact) {
      throw new NotFound(`No contact with ID: ${req.params.id}`);
    }

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contactId = ObjectId(req.params.id);
    const user = req.user;
    const deletedContact = await user.deleteContact(contactId);

    if (!deletedContact) {
      throw new NotFound(`No contact with ID: ${req.params.id}`);
    }

    res.status(200).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createContact,
  updateContact,
  getContacts,
  getContactById,
  deleteContact,
};
