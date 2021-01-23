const { Schema } = require("mongoose");

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
    default: "http://localhost:3000/images/defaultAvatar.jpg",
  },
  avatarFilename: { type: String, required: true },
});

function validateEmail(email) {
  const isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
  return isValid;
}
