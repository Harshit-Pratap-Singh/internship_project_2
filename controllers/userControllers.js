const User = require("../models/user.js");

const user = new User({
  username: "test@test.com",
  password: "test",
});

const getUser = (req, res) => {
  const username = req.user.username;
  console.log(username);
  User.findOne({ username })
    .select("username followers following")
    .exec()
    .then((val) => {
      console.log(val);
      if (!val)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      res.status(200).json({
        success: true,
        username: val.username,
        followers: val?.followers?.length || 0,
        following: val?.following?.length || 0,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ success: false, error: e });
    });
};

const followUser = async (req, res) => {
  try {
    const otherUser = await User.findOne({ user_id: req.params.id }).exec();
    const user = await User.findOne({ username: req.user.username }).exec();
    // console.log(user);
    // console.log(otherUser);
    if (!user || !otherUser || user == otherUser)
      return res.status(500).json({ success: false });
    const check = otherUser.followers.filter((item) => {
      console.log(item.equals(user.user_id));
      return item.equals(user.user_id);
    });
    console.log(check);
    if (check.length)
      return res
        .status(400)
        .json({ success: false, message: "Already following" });
    otherUser.followers.push(user.user_id);
    // console.log(otherUser);
    user.following.push(otherUser.user_id);
    // console.log(user);
    await otherUser.save();
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const otherUser = await User.findOne({ user_id: req.params.id }).exec();
    const user = await User.findOne({ username: req.user.username }).exec();
    // console.log(user);
    // console.log(otherUser);
    if (!user || !otherUser || user == otherUser)
      return res.status(500).json({ success: false });
    const check1 = otherUser.followers.filter((item) => {
      // console.log(item.equals(user.user_id));
      return item.equals(user.user_id);
    });
    const check2 = user.following.filter((item) => {
      // console.log(item.equals(otehrUser.user_id));
      return item.equals(otherUser.user_id);
    });
    if (!(check1.length && check2.length))
      return res
        .status(400)
        .json({ success: false, message: "Not following user" });
    otherUser.followers = otherUser.followers.filter((item) => {
      console.log(!item.equals(user.user_id));
      return !item.equals(user.user_id);
    });
    console.log(otherUser.followers);

    user.following = user.following.filter((item) => {
      console.log(!item.equals(otherUser.user_id));
      return !item.equals(otherUser.user_id);
    });
    console.log(user.following);
    await user.save();
    await otherUser.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

module.exports = { getUser, followUser, unfollowUser };
