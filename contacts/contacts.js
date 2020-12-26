const path = require("path");
const fsPromises = require("fs").promises;

const contactsPath = path.resolve('./db/contacts.json');

/** Get list of contacts
 * @returns {array} - array of contacts
 */
async function listContacts() {
  try {
    const contacts = await fsPromises
      .readFile(contactsPath)
      .then((data) => JSON.parse(data));
    return contacts;
  } catch (err) {
    throw err;
  }
}

/** Get contact by id
 * @param {number} id - contact id
 * @returns {object || undefined} - object: contact, undefined: not found
 */
async function getContactById(id) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === id);
    return contact;
  } catch (err) {
    throw err;
  }
}

/** Delete contact
 * @param {number} id - contact id
 * @returns {boolean} - true: removed successfully, false: not found
 */
async function removeContact(id) {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter((contact) => contact.id !== id);

    const passed = contacts.length !== newContacts.length;

    if (passed) {
      await fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
    }
    return passed;
  } catch (err) {
    throw err;
  }
}

/** Add contact
 * @param {object} contact - data of contact
 * @param {string} contact.name - name of contact
 * @param {string} contact.email - email of contact
 * @param {string} contact.phone - phone of contact
 * @returns {object || false} - added contact or false: contact is already present
 */
async function addContact({ name, email, phone }) {
  try {
    const contacts = await listContacts();
    const isPresent = contacts.some((contact) => {
      return contact.name === name;
    });

    if (isPresent) {
      return false;
    }

    const makeId = () => Math.max(...contacts.map((contact) => contact.id)) + 1;

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

    return contact;
  } catch (err) {
    throw err;
  }
}

/** Edit contact
 * @param {number} id - id of contact
 * @param {object} contactData - data of contact
 * @returns {object || undefined} - updated contact or undefined
 */
async function editContact(id, contactData) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === id);

    if (!contact) return undefined;

    const contactsUpdated = contacts.map((contact) => {
      if (contact.id === id) {
        return {
          ...contact,
          ...contactData,
        };
      }
      return contact;
    });

    await fsPromises.writeFile(contactsPath, JSON.stringify(contactsUpdated));

    const contactNew = contactsUpdated.find((contact) => contact.id === id);

    return contactNew;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  editContact,
};
