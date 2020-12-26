const server = require("./server/server");
const config = require("dotenv").config();

const port = process.env.PORT || 3030;

server.start({ port });
