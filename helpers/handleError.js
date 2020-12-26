module.exports.handleError = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Oops... Something went wrong!" });
};
