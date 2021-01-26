const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const contactsRouter = require("./contacts/contact.router");
const userRouter = require("./users/user.router");
const authRouter = require("./auth/auth.router");
const publicRouter = require("./public/public.router");

class Server {
  /**
   *  Server
   * @param {String} port
   * @param {String} dataBaseUrl
   */
  constructor(port, dataBaseUrl) {
    this.app = null;
    this.port = port;
    this.dataBaseUrl = dataBaseUrl;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.connectToDB();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  initMiddlewares() {
    this.app.use(morgan("tiny"));
    this.app.use(express.json());
    this.app.use(cors());
  }

  initRoutes() {
    this.app.use("/api/contacts", contactsRouter);
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/", publicRouter);
  }

  async connectToDB() {
    try {
      await mongoose.connect(this.dataBaseUrl, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });

      console.log("Database connection successful");
    } catch (err) {
      console.log("Database connection unsuccessful");
      console.log(err.message);
      process.exit(1);
    }
  }

  startListening() {
    this.app.listen(this.port, () =>
      console.log(`Listening on port: ${this.port}`)
    );
  }
}

module.exports = Server;
