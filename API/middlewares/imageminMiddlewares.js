const path = require("path");
const fsPromises = require("fs").promises;

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

module.exports = async function minimizeAndSaveAvatar(req, res, next) {
  try {
    if (!req.file) {
      return next();
    }

    await imagemin([`tmp/${req.file.filename}`], {
      destination: "static/images",
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });

    await fsPromises.unlink(req.file.path);

    req.file = {
      ...req.file,
      destination: path.join(__dirname, "../../static/images"),
      path: path.join(__dirname, "../../static/images", req.file.filename),
    };

    next();
  } catch (err) {
    next(err);
  }
};
