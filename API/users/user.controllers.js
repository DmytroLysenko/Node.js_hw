const User = require("./user.model");

function currentUser(req, res, next) {
  const user = {
    _id: req.user._id,
    email: req.user.email,
    subscription: req.user.subscription,
  };
  res.status(200).json(user);
}

async function currentUserWithContacts(req, res, next) {
  try {
    const { _id, email, subscription } = req.user;
    const contacts = await req.user.getContacts();

    const responseData = {
      _id,
      email,
      subscription,
      contacts,
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = req.user;
    const { subscription } = req.body;

    if (subscription === req.user.subscription) {
      return res.status(200).send();
    }

    await user.updateUserSub(subscription);

    return res.status(200).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  currentUser,
  currentUserWithContacts,
  updateUser,
};
