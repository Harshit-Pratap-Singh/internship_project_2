require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  getUser,
  followUser,
  unfollowUser,
} = require("./controllers/userControllers");
const {
  createPost,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts,
} = require("./controllers/postControllers");
const { createComment } = require("./controllers/commentController");

const app = express();
const PORT = 3000;

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(req.headers.authorization);
  const token = authHeader && authHeader.split(" ")[0];
  if (token == null) return res.sendStatus(401);
  // console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// const User = require("./models/user.js");

// const createUser=async()=>{

//   for(var i=0;i<10;i++){
//   const user = new User({
//     username: "test"+i+"@test.com",
//     password: "test",
//   });
//   await user.save()
// }
// }
// createUser();

// const getUser = () => {
//   // const user_id=req.params.id;
//   const user_id = "636d09090d883d6612c61f25";
//   User.findOne({ user_id })
//     .select("username followers following")
//     .exec()
//     .then((val) => {
//       if(!val)console.log("sdfhdsk");
//       console.log(val);
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// };
// getUser();

app.get("/api/authenticate", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const accessToken = jwt.sign(
    { username: username },
    process.env.ACCESS_TOKEN_SECRET
  );
  res.json({ accessToken: accessToken });
});

app.route("/api/user").get(checkAuth, getUser);
app.route("/api/follow/:id").post(checkAuth, followUser);
app.route("/api/unfollow/:id").post(checkAuth, unfollowUser);
app.route("/api/posts").post(checkAuth, createPost);
app
  .route("/api/posts/:id")
  .get(checkAuth, getPost)
  .delete(checkAuth, deletePost);
app.route("/api/like/:id").post(checkAuth, likePost);
app.route("/api/unlike/:id").post(checkAuth, unlikePost);
app.route("/api/comment/:id").post(checkAuth, createComment);
app.route("/api/all_posts").get(checkAuth, getUserPosts);

app.listen(PORT);
