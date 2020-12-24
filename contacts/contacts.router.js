const express = require("express");
const router = express.Router();

const {
  getList,
  getById,
  removeById,
  addItem,
  editById,
} = require("./contacts.controllers");

const {
  validateAddContact,
  validateEditContact,
} = require("./contacts.validations");

router.get("/", getList);
router.get("/:id", getById);
router.delete("/:id", removeById);
router.post("/", validateAddContact, addItem);
router.patch("/:id", validateEditContact, editById);

module.exports = router;
