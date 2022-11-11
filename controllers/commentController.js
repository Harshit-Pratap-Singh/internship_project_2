const Comment = require("../models/comment");
const Post = require("../models/post");

const getComment = async (post_id) => {
  try {
    const comments = await Comment.find({ post_id })
      .select("comment createdAt")
      .sort({ createdAt: -1 })
      .exec();
    return {
      success: true,
      comments,
    };
  } catch (err) {
    console.log(err);
    return { success: false, error: err };
  }
};

const createComment = async(req, res) => {
  const post_id = req.params.id;
  console.log("post_id-->", post_id);
  const check=await Post.find({post_id}).exec();
  if(!check.length)return res.status("404").json({success:false,message:"post not found"});
  console.log("comment-->", req.body.comment);
  const comment = new Comment({
    comment: req.body.comment,
    post_id,
  });
  comment
    .save()
    .then((val) => {
      console.log(val);
      res.status(200).json({
        success: true,
        comment_id: val.comment_id,
      });
    })
    .catch((err) => {
      console.log(err);
      return { success: false, error: err };
    });
};

const deletComments = async (post_id) => {
  try {
    const val = await Comment.deleteMany({ post_id });
    console.log(val);
    return { success: true, val };
  } catch (err) {
    console.log(err);
    return { success: false, error: err };
  }
};

module.exports = { getComment, createComment, deletComments };
