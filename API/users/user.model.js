const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

module.exports = mongoose.model("User", userSchema);
