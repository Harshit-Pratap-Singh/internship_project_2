const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user.js");
const { getComment, deletComments } = require("./commentController");

const createPost = async (req, res) => {
  try {
    const username = req.user.username;
    const val = await User.findOne({ username }).select("user_id").exec();
    const post = new Post({
      title: req.body.title,
      desc: req.body.desc,
      user_id: val.user_id,
    });
    post
      .save()
      .then((val) => {
        console.log(val);
        res.status(200).json({
          post_id: val.post_id,
          title: val.title,
          desc: val.desc,
          createdAt: val.createdAt,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

const getPost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const val = await Post.findOne({ post_id }).exec();
    if (!val) return res.status(404).json({ success: false });
    const response = await getComment(post_id);
    if (!response.success) return res.status(500).json(response);
    const comments = response.comments;
    res.status(200).json({
      success: true,
      post_id: val.post_id,
      title: val.title,
      desc: val.desc,
      comments: comments,
      createdAt: val.createdAt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

const deletePost = async (req, res) => {
  const post_id = req.params.id;
  const res_comment = await deletComments(post_id);
  console.log(res_comment);
  if (!res_comment.success) return res.status(500).json(res_comment);
  Post.deleteOne({ post_id })
    .then((val) => {
      res.status(200).json({
        success: true,
        message: "Post has been deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

const likePost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const post = await Post.findOne({ post_id }).exec();
    if (!post) return res.status(500).json({ success: false });
    console.log(post.likes);
    post.likes = post.likes + 1;
    await post.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

const unlikePost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const post = await Post.findOne({ post_id }).exec();
    if (!post) return res.status(500).json({ success: false });
    console.log(post.likes);
    post.likes = post.likes - 1;
    await post.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const user_id = (await User.findOne({ username: req.user.username }).exec())
      .user_id;
    let posts = await Post.find({ user_id }).sort({ createdAt: -1 }).exec();
    const allPosts = await Promise.all(
      posts.map(async (post) => {
        const response = await getComment(post.post_id);
        if (!response.success) throw response;
        const comments = response.comments;
        console.log(comments);
        return {
          post_id: post.post_id,
          comments,
          createdAt:post.createdAt,
          title:post.title,
          desc:post.desc,
          likes:post.likes
        };
      })
    );
    console.log(allPosts);
    res.status(200).json({
      success: true,
      allPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

module.exports = {
  createPost,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts,
};
