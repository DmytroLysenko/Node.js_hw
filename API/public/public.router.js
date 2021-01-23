const express = require("express");
const path = require("path");

const publicRouter = express.Router();

const imagesPath = path.join(__dirname, "../../static/images");

publicRouter.use("/images", express.static(imagesPath));

module.exports = publicRouter;
