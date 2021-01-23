function currentUser(req, res, next) {
  const user = {
    email: req.user.email,
    subscription: req.user.subscription,
    avatarURL: req.user.avatarURL,
  };
  res.status(200).json(user);
}

async function currentUserWithContacts(req, res, next) {
  try {
    const { email, subscription, avatarURL } = req.user;
    const contacts = await req.user.getContacts();

    const responseData = {
      email,
      subscription,
      avatarURL,
      contacts,
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
}

async function updateUserSub(req, res, next) {
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

async function updateUserAvatar(req, res, next) {
  try {
    const { user, file } = req;

    const updatedUser = await user.updateUserAvatar(file);

    return res.status(200).json({ avatarURL: updatedUser.avatarURL });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  currentUser,
  currentUserWithContacts,
  updateUserSub,
  updateUserAvatar,
};
