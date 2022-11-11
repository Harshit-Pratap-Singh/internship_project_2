const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    post_id: {
        type:mongoose.Schema.Types.ObjectId,
        auto:true,
    },
    user_id: mongoose.Types.ObjectId,
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports=mongoose.model("Post",postSchema);
