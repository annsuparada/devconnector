const express = require("express");
const router = express.Router();
const auth = require("../../middlewere/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../modules/User");
const Post = require("../../modules/Posts");
const Profile = require("../../modules/Profile");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //sort recent date
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// @route   GET api/posts/:post_id
// @desc    Get a post by Id
// @access  Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });
    res.status(500).json("Server Error");
  }
});

// @route   Delete api/posts/:post_id
// @desc    Delete a post by Id
// @access  Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });
    res.status(500).json("Server Error");
  }
});
module.exports = router;
