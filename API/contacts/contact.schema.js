const { Schema } = require("mongoose");

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: validateEmail,
    unique: true,
  },
  phone: {
    type: String,
    validate: validatePhone,
    default: null,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
});

function validateEmail(email) {
  const isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
  return isValid;
}

function validatePhone(phone) {
  if (!phone) {
    return true;
  }
  const isValid = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phone);
  return isValid;
}
