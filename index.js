const argv = require("yargs").argv;

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} = require("./contacts");

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts()
        .then((data) => console.table(data))
        .catch((err) => handleError(err));
      break;

    case "get":
      getContactById(id)
        .then((contact) =>
          console.log(contact ? contact : `Contact with id:${id} not found`)
        )
        .catch((err) => handleError(err));
      break;

    case "add":
      if (!name) {
        console.warn("\x1B[31m Name - required parameter!");
        break;
      }
      addContact(name, email, phone)
        .then((status) =>
          console.log(
            `Contact ${name} ${status ? "was added" : "is already present"}`
          )
        )
        .catch((err) => handleError(err));
      break;

    case "remove":
      removeContact(id)
        .then((status) =>
          console.log(
            `Contact with id:${id} ${status ? "was removed" : "not found"}`
          )
        )
        .catch((err) => handleError(err));
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);

function handleError(error) {
  console.warn(`\x1B[31m ${error.message}`);
}
