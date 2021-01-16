const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Contact = require("../contacts/contact.model");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const costFactor = Number(process.env.BCRYPT_COST_FACTOR);

const userSchema = require("./user.schema");

userSchema.methods.makeToken = function makeToken(payload) {
  return jwt.sign({ ...payload }, JWT_SECRET);
};

userSchema.statics.getPayloadFromToken = function getPayloadFromToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch {
    return false;
  }
};

userSchema.statics.makeHashPassword = async function makeHashPassword(
  password
) {
  try {
    const passwordHash = await bcrypt.hash(password, costFactor);
    return passwordHash;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.isPasswordInvalid = async function isPasswordInvalid(
  password,
  passwordHash
) {
  try {
    const result = await bcrypt.compare(password, passwordHash);
    return result ? false : true;
  } catch (error) {
    throw err;
  }
};

userSchema.methods.getContacts = async function getContacts({
  skip,
  limit,
} = {}) {
  try {
    if (!limit) {
      const contacts = await Contact.find({ userId: this._id });
      return contacts;
    }
    const contacts = await Contact.find({ userId: this._id })
      .skip(skip)
      .limit(limit);
    const contactsCount = await Contact.find({ userId: this._id }).count();
    const result = {
      contacts,
      skip,
      limit,
      contactsCount,
      page: skip / limit + 1,
      totalPage: Math.ceil(contactsCount / limit),
    };
    return result;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.getContactById = async function getContactById(contactId) {
  try {
    const contact = await Contact.find({ userId: this._id, _id: contactId });
    return contact;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.isContactExist = async function isContactExist(contactData) {
  try {
    const { name, email, phone } = contactData;
    const contacts = await this.getContacts();

    const result = contacts.filter(
      (contact) =>
        contact.name === name &&
        contact.email === email &&
        contact.phone === phone
    );
    return result.length !== 0 ? true : false;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.addContact = async function addContact(contactData) {
  try {
    const contact = new Contact({
      ...contactData,
      userId: this._id,
    });
    await contact.save();
    return contact;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.deleteContact = async function deleteContact(contactId) {
  try {
    const contact = await Contact.findByIdAndRemove(contactId);
    return contact;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.updateContact = async function updateContact(
  contactId,
  contactData
) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      {
        $set: { ...contactData },
      },
      { new: true }
    );
    return contact;
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("User", userSchema);
