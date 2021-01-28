const path = require("path");
const fsPromises = require("fs").promises;
const { BadRequest } = require("../helpers/error.constructors");

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

async function minimizeAndSaveAvatar(req, res, next) {
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
}

async function validateAvatar(req, res, next) {
  try {
    if (!req.file) {
      return next();
    }

    const removeFile = async (path) => {
      await fsPromises.unlink(path);
    };

    const ext = path.extname(req.file.originalname).toLowerCase();
    const size = req.file.size;

    if (!ext) {
      await removeFile(req.file.path);
      throw new BadRequest("File extension must be present");
    }
    if (ext !== ".jpg" && ext !== ".png") {
      await removeFile(req.file.path);
      throw new BadRequest('File extension must be "jpg" or "png"');
    }
    if (size > 8e7) {
      await removeFile(req.file.path);
      throw new BadRequest("File size must be less than 10M");
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  minimizeAndSaveAvatar,
  validateAvatar,
};
