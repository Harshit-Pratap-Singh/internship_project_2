const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, key: true, auto: true },
  username: {
    type: String,
    required: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
  },
  following: [mongoose.Types.ObjectId],
  followers: [mongoose.Types.ObjectId],
});

module.exports = new mongoose.model("User", userSchema);
