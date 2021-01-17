const {
  Schema,
  SchemaTypes: { ObjectId },
} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

module.exports = new Schema({
  name: {
    type: String,
    min: 3,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: validateEmail,
  },
  phone: {
    type: String,
    required: true,
    validate: validatePhone,
  },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  password: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  userId: { type: ObjectId, required: true },
}).plugin(mongoosePaginate);

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
