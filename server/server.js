const express = require("express");
const app = express();

const contactsRouter = require("../contacts/contacts.router");

const cors = require("cors");
const morgan = require("morgan");

const start = ({ port }) => {
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cors());

  app.use("/api/contacts", contactsRouter);

  return app.listen(port, () =>
    console.log(`\x1B[34m Listening on port: ${port}!`)
  );
};

module.exports = {
  start,
};
