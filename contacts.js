const path = require("path");
const fs = require("fs");
const shortid = require("shortid");

const contactsPath = path.resolve("./db/contacts.json");

/** Displays a list of contacts
 * @param {null} - not receive any params
 * @returns {console} - table of contacts
 */
function listContacts() {
  fs.readFile(contactsPath, (err, data) => {
    if (err) {
      handleError(err);
      return;
    }
    console.table(JSON.parse(data));
  });
}

/** Find and displays contact
 * @param {string} contactId
 * @returns {console} - contact or message if not found
 */
function getContactById(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) {
      handleError(err);
      return;
    }

    const contact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );

    console.log(
      contact ? contact : `Contact with id: ${contactId} not present`
    );
  });
}

/** Find and remove contact
 * @param {string} contactId
 * @returns {console} - progress message
 */
function removeContact(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) {
      handleError(err);
      return;
    }

    const contact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );

    if (!contact) {
      console.log(`Contact with id: ${contactId} not present`);
      return;
    }

    const contacts = JSON.stringify(
      JSON.parse(data).filter((contact) => contact.id !== contactId)
    );

    fs.writeFile(contactsPath, contacts, (err) => {
      if (err) {
        handleError(err);
        return;
      }
    });

    console.log(`Contact with id: ${contactId} was remove successfully`);
  });
}

/** Add contact
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @returns {console} - progress message
 */
function addContact(name, email = null, phone = null) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) {
      handleError(err);
      return;
    }

    const contacts = JSON.parse(data);

    const newContact = {
      id: shortid.generate(),
      name,
      email,
      phone,
    };

    if (isContactPresent(contacts, newContact)) {
      console.log("This contact ia already present");
      return;
    }

    contacts.push(newContact);

    fs.writeFile(contactsPath, JSON.stringify(contacts), (err) => {
      if (err) console.log(err);
    });
    console.log(`Contact ${name} was added successfully`);
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

function isContactPresent(contactsList, contact) {
  return contactsList
    .filter((_) => _.name === contact.name)
    .filter((_) => _.email === contact.email)
    .filter((_) => _.phone === contact.phone).length === 0
    ? false
    : true;
}

function handleError(error) {
  console.log(error);
}
