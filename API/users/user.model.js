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

userSchema.statics.makePasswordHash = makePasswordHash;
userSchema.statics.getPayloadFromToken = getPayloadFromToken;
userSchema.statics.getUserByVerificationToken = getUserByVerificationToken;
userSchema.statics.getUserByEmail = getUserByEmail;

userSchema.methods.generateAndSaveToken = generateAndSaveToken;
userSchema.methods.deleteToken = deleteToken;
userSchema.methods.isTokenEqual = isTokenEqual;
userSchema.methods.isPasswordValid = isPasswordValid;

userSchema.methods.updateUserSub = updateUserSub;
userSchema.methods.updateUserAvatar = updateUserAvatar;
userSchema.methods.updateVerificationToken = updateVerificationToken;

userSchema.methods.getContactsWithPagination = getContactsWithPagination;
userSchema.methods.getContacts = getContacts;
userSchema.methods.getContactById = getContactById;
userSchema.methods.isContactExist = isContactExist;
userSchema.methods.addContact = addContact;
userSchema.methods.deleteContact = deleteContact;
userSchema.methods.updateContact = updateContact;

async function generateAndSaveToken() {
  try {
    this.token = makeToken.bind(this)();
    await this.save();
    return this;
  } catch (err) {
    throw err;
  }
}

async function deleteToken() {
  try {
    this.token = null;
    await this.save();
    return this;
  } catch (err) {
    throw err;
  }
}

function getPayloadFromToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch {
    return false;
  }
}

function isTokenEqual(token) {
  return token === this.token ? true : false;
}

async function makePasswordHash(password) {
  try {
    const passwordHash = await bcrypt.hash(password, costFactor);
    return passwordHash;
  } catch (error) {
    throw error;
  }
}

async function isPasswordValid(password) {
  try {
    const result = await bcrypt.compare(password, this.password);
    return result ? true : false;
  } catch (error) {
    throw err;
  }
}

async function updateUserSub(subscription) {
  try {
    this.subscription = subscription;
    await this.save();
    return this;
  } catch (err) {
    throw err;
  }
}

async function getContacts() {
  try {
    const contacts = await Contact.find({ userId: this._id });
    return contacts;
  } catch (err) {
    throw err;
  }
}

async function getContactsWithPagination(options) {
  try {
    const contacts = await Contact.paginate({ userId: this._id }, options);
    return contacts;
  } catch (err) {
    throw err;
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findOne({ userId: this._id, _id: contactId });
    return contact;
  } catch (err) {
    throw err;
  }
}

async function isContactExist(contactData) {
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
}

async function addContact(contactData) {
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
}

async function deleteContact(contactId) {
  try {
    const contact = await Contact.findByIdAndRemove(contactId);
    return contact;
  } catch (err) {
    throw err;
  }
}

async function updateContact(contactId, contactData) {
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
}

async function updateUserAvatar(filename) {
  try {
    const isPassed =
      this.avatarFilename && this.avatarFilename !== DEFAULT_AVATAR_FILENAME;

    if (isPassed) {
      await fsPromises.unlink(
        path.join(__dirname, "../../static/images", this.avatarFilename)
      );
    }

    (this.avatarURL = `${IMAGES_SOURCE}/${filename}`),
      (this.avatarFilename = filename),
      await this.save();
    return this;
  } catch (err) {
    throw err;
  }
}

async function updateVerificationToken(value) {
  try {
    this.verificationToken = value;
    await this.save();
    return this.verificationToken;
  } catch (err) {
    throw err;
  }
}

async function getUserByVerificationToken(verificationToken) {
  try {
    const user = await this.findOne({ verificationToken: verificationToken });
    return user ? user : null;
  } catch (err) {
    throw err;
  }
}

async function getUserByEmail(email) {
  try {
    const user = await this.findOne({ email });
    return user ? user : null;
  } catch (err) {
    nextTick(err);
  }
}

module.exports = mongoose.model("User", userSchema);
