const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  editContact,
} = require("./contacts");

const { handleError } = require("../helpers/handleError");

const getList = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      res.status(400).json({ message: "invalid id value!" });
      return;
    }

    const contact = await getContactById(id);

    return contact
      ? res.status(200).json({ contact })
      : res.status(404).json({ message: `contact with id: ${id} not found` });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const removeById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "invalid id value!" });
    }

    const passed = await removeContact(id);

    return passed
      ? res.status(200).json({ message: `contact with id:${id} was deleted` })
      : res.status(404).json({ message: `contact with id:${id} not found` });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const contact = await addContact({ name, email, phone });

    return contact
      ? res.status(201).json({ contact })
      : res.status(400).json({ message: `${name} is already present` });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const editById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const contactData = req.body;

    const contact = await editContact(id, contactData);

    return contact
      ? res.status(200).json({ contact })
      : res.status(404).json({ message: `contact with id:${id} not found` });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

module.exports = {
  getList,
  getById,
  removeById,
  addItem,
  editById,
};
