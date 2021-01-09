function currentUser(req, res, next) {
  const user = {
    email: req.user.email,
    subscription: req.user.subscription,
  };
  res.status(200).json(user);
}

module.exports = {
  currentUser,
};
