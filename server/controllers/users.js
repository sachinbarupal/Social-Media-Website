import User from "../models/User.js";

// //READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(({ _id, userName, picturePath }) => {
      return { _id, userName, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $pull: { friends: friendId },
        },
        { new: true }
      );

      await User.findByIdAndUpdate(
        friendId,
        {
          $pull: { friends: id },
        },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    }

    user.friends.push(friendId);
    friend.friends.push(id);

    await user.save();
    await friend.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({
      error: err.message,
    });
  }
};
