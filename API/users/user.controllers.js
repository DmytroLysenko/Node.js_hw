const IMAGES_SOURCE = process.env.IMAGES_SOURCE;
const DEFAULT_AVATAR_FILENAME = process.env.DEFAULT_AVATAR_FILENAME;

function currentUser(req, res, next) {
  const avatarURL = req.user.avatarURL
    ? req.user.avatarURL
    : `${IMAGES_SOURCE}/${DEFAULT_AVATAR_FILENAME}`;

  const response = {
    email: req.user.email,
    subscription: req.user.subscription,
    avatarURL,
  };
  res.status(200).json(response);
}

async function currentUserWithContacts(req, res, next) {
  try {
    const { email, subscription } = req.user;
    const contacts = await req.user.getContacts();

    const avatarURL = req.user.avatarURL
      ? req.user.avatarURL
      : `${IMAGES_SOURCE}/${DEFAULT_AVATAR_FILENAME}`;

    const response = {
      email,
      subscription,
      avatarURL,
      contacts,
    };

    res.status(200).json(response);
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
    const filename = file ? file.filename : DEFAULT_AVATAR_FILENAME;

    const updatedUser = await user.updateUserAvatar(filename);

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
