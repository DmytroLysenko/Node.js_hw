const path = require("path");
const fsPromises = require("fs").promises;

const contactsPath = path.resolve("./db/contacts.json");

/** Return list of contacts
 * @param {null} - not receive any params
 * @returns {promises} - list of contacts
 */
async function listContacts() {
  try {
    const contacts = fsPromises
      .readFile(contactsPath)
      .then((data) => JSON.parse(data));
    return contacts;
  } catch (err) {
    throw err;
  }
}

/** Async get contact by id
 * @param {number} contactId
 * @returns {promises} contact
 */
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact;
  } catch (err) {
    throw err;
  }
}

/** Async remove contact
 * @param {number} contactId
 * @returns {boolean} status: true - success, false - failure
 */
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter((contact) => contact.id !== contactId);

    const status = contacts.length !== newContacts.length;

    if (status) {
      await fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
    }
    return status;
  } catch (err) {
    throw err;
  }
}

/** Async add contact
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @returns {boolean} status: true - success, false - failure
 */
async function addContact(name, email = null, phone = null) {
  try {
    const contacts = await listContacts();
    const status = !contacts.some((contact) => {
      return contact.name === name;
    });

    if (status) {
      const makeId = () =>
        Math.max(...contacts.map((contact) => contact.id)) + 1;

      const contact = {
        id: makeId(),
        name,
        email,
        phone,
      };
      await fsPromises.writeFile(
        contactsPath,
        JSON.stringify([...contacts, contact])
      );
    }
    return status;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
