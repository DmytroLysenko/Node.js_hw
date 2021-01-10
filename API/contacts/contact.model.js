const mongoose = require("mongoose");

const contactSchema = require("./contact.schema");

module.exports = mongoose.model("Contact", contactSchema);
