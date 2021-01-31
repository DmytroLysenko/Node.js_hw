const { Schema } = require("mongoose");

const IMAGES_SOURCE = process.env.IMAGES_SOURCE;
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
  verificationToken: {
    type: String,
    required: false,
  },
  avatarURL: {
    type: String,
    default: `${IMAGES_SOURCE}/${DEFAULT_AVATAR_FILENAME}`,
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
