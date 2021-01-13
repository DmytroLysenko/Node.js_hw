const User = require("./user.model");


function currentUser(req, res, next) {
  const user = {
    email: req.user.email,
    subscription: req.user.subscription,
  };
  res.status(200).json(user);
}

async function updateUser(req, res, next) {
  try {
    const { subscription } = req.body;
    if (subscription === req.user.subscription) {
      return res.status(200).send();
    }

    const { id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          subscription,
        },
      },
      { new: true }
    );
    return res.status(200).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  currentUser,
  updateUser,
};
