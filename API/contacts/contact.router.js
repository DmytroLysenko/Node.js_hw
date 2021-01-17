const { Router } = require("express");

const contactControllers = require("./contact.controllers");
const contactMiddlewares = require("../middlewares/contactMiddlewares");
const { isAuthorized } = require("../middlewares/authMiddlewares");

const router = Router();

router.use(isAuthorized);

router.post(
  "/",
  contactMiddlewares.validateCreateContact,
  contactControllers.createContact
);

router.patch(
  "/:id",
  contactMiddlewares.validateID,
  contactMiddlewares.validateUpdateContact,
  contactControllers.updateContact
);

router.get("/", contactControllers.getContacts);

router.get(
  "/:id",
  contactMiddlewares.validateID,
  contactControllers.getContactById
);

router.delete(
  "/:id",
  contactMiddlewares.validateID,
  contactControllers.deleteContact
);

module.exports = router;
