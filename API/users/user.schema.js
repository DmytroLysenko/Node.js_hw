const { Schema } = require("mongoose");
require("dotenv").config();

const IMAGES_BUCKET = process.env.IMAGES_BUCKET;
const DEFAULT_AVATAR_FILENAME = process.env.DEFAULT_AVATAR_FILENAME;

module.exports = new Schema({
  email: {
    type: String,
    required: true,
    validate: validateEmail,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: `${IMAGES_BUCKET}/${DEFAULT_AVATAR_FILENAME}`,
  },
  avatarFilename: {
    type: String,
    default: DEFAULT_AVATAR_FILENAME,
  },
});

function validateEmail(email) {
  const isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
  return isValid;
}
