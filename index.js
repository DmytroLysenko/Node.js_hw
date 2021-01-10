const Server = require("./API/server");
require("dotenv").config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const myServer = new Server(PORT, DATABASE_URL);

myServer.start();
