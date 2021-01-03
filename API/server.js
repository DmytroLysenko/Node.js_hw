const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

async function start() {
  initMiddlewares();
  initRoutes();
  await connectToDB();
  startListening();
}

function initMiddlewares() {
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cors());
}

function initRoutes() {
  const contactsRouter = require("./contacts/contact.router");
  app.use("/api/contacts", contactsRouter);
}

async function connectToDB() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;

    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection unsuccessful");
    console.log(err.message);
    process.exit(1);
  }
}

function startListening() {
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`\x1B[34m Listening on port: ${PORT}`));
}

module.exports = {
  start,
};
