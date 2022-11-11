const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment_id:{
        type: mongoose.Schema.Types.ObjectId,
        auto:true
    },
    post_id: {
        type:mongoose.Types.ObjectId,
        required:true
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports=mongoose.model("Comment",commentSchema);
