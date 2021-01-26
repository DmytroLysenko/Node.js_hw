const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fsPromises = require("fs").promises;
const path = require("path");
const Contact = require("../contacts/contact.model");

const JWT_SECRET = process.env.JWT_SECRET;
const costFactor = Number(process.env.BCRYPT_COST_FACTOR);
const IMAGES_SOURCE = process.env.IMAGES_SOURCE;
const DEFAULT_AVATAR_FILENAME = process.env.DEFAULT_AVATAR_FILENAME;

const userSchema = require("./user.schema");

function makeToken() {
  return jwt.sign({ id: this._id }, JWT_SECRET);
}

userSchema.methods.generateAndSaveToken = async function generateAndSaveToken() {
  try {
    this.token = makeToken.bind(this)();
    await this.save();
    return this;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.deleteToken = async function deleteToken() {
  try {
    this.token = null;
    await this.save();
    return this;
  } catch (err) {
    throw err;
  }
};

userSchema.statics.getPayloadFromToken = function getPayloadFromToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch {
    return false;
  }
};

userSchema.methods.isTokenEqual = function isTokenEqual(token) {
  return token === this.token ? true : false;
};

userSchema.statics.makePasswordHash = async function makePasswordHash(
  password
) {
  try {
    const passwordHash = await bcrypt.hash(password, costFactor);
    return passwordHash;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.isPasswordValid = async function isPasswordValid(password) {
  try {
    const result = await bcrypt.compare(password, this.password);
    return result ? true : false;
  } catch (error) {
    throw err;
  }
};

userSchema.methods.updateUserSub = async function updateUserSub(subscription) {
  try {
    this.subscription = subscription;
    await this.save();
    return this;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.getContacts = async function getContacts() {
  try {
    const contacts = await Contact.find({ userId: this._id });
    return contacts;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.getContactsWithPagination = async function getContactsWithPagination(
  options
) {
  try {
    const contacts = await Contact.paginate({ userId: this._id }, options);
    return contacts;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.getContactById = async function getContactById(contactId) {
  try {
    const [contact] = await Contact.find({ userId: this._id, _id: contactId });
    return contact;
  } catch (err) {
    throw err;
  }
};

userSchema.methods.isContactExist = async function isContactExist(contactData) {
  try {
    const { email, phone } = contactData;
    const contacts = await this.getContacts();

    const contact = contacts.find(
      (contact) => contact.email === email && contact.phone === phone
    );
    return contact ? true : false;
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

userSchema.methods.updateUserAvatar = async function updateUserAvatar(
  filename
) {
  try {
    const isPassed =
      this.avatarFilename && this.avatarFilename !== DEFAULT_AVATAR_FILENAME;

    if (isPassed) {
      await fsPromises.unlink(
        path.join(__dirname, "../../static/images", this.avatarFilename)
      );
    }

    console.log(IMAGES_SOURCE)
    this.avatarURL = `${IMAGES_SOURCE}/${filename}`,
    this.avatarFilename = filename,

    await this.save();
    return this;
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("User", userSchema);
