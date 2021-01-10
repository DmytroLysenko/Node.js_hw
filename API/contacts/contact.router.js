const { Router } = require("express");

const contacts = require("./contact.controllers");

const router = Router();

router.post("/", contacts.validateCreateContact, contacts.createContact);

router.patch(
  "/:id",
  contacts.validateID,
  contacts.validateUpdateContact,
  contacts.updateContact
);

router.get("/", contacts.getContacts);

router.get("/:id", contacts.validateID, contacts.getContactById);

router.delete("/:id", contacts.validateID, contacts.deleteContact);

module.exports = router;
