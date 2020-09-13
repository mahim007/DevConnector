const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const validatePostInput = require("../../validation/post");

// @route   GET /api/posts/test
// @desc    Test route for posts
// @access  public

router.get("/test", (req, res) => res.json({ msg: "posts work" }));

// @route   GET /api/posts
// @desc    GET posts
// @access  public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET /api/posts/:id
// @desc    GET post by id
// @access  public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
});

// @route   POST /api/posts
// @desc    Create post
// @access  private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.status(404).json(err));
  }
);

// @route   POST /api/posts/like/:id
// @desc    Create like for a post
// @access  private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyLiked: "User already liked the post" });
        }

        post.likes.unshift({ user: req.user.id });
        post
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.status(404).json({ success: false }));
      })
      .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   POST /api/posts/unlike/:id
// @desc    Create unlike for a post
// @access  private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notLiked: "User did not like the post" });
        }

        const removeIndex = post.likes
          .map((like) => like.user.toString())
          .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        post
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.status(404).json({ success: false }));
      })
      .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   POST /api/posts/comment/:postId
// @desc    Create comment for a post
// @access  private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        post.comments.unshift(newComment);
        post
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.status(404).json({ success: false }));
      })
      .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete post by id
// @access  private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "user not authorized" });
        }

        post
          .remove()
          .then((post) => res.json({ success: true }))
          .catch((err) => res.status(500).json({ success: false }));
      })
      .catch((err) => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   DELETE /api/posts/comment/:postId/:commentId
// @desc    Delete comment from a post
// @access  private

router.delete(
  "/comment/:id/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params.id);
    console.log(req.params.commentId);
    Post.findById(req.params.id)
      .then((post) => {
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.commentId
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexist: "Comment does not exist" });
        }
        const removeIndex = post.comments
          .map((comment) => {
            if (comment.user.toString() === req.user.id) {
              return comment._id.toString();
            }
          })
          .indexOf(req.params.commentId);
        console.log(`removed index: ${removeIndex}`);
        if (removeIndex < 0) {
          return res
            .status(401)
            .json({ notauthorized: "Comment doesn't belong to current user" });
        }
        post.comments.splice(removeIndex, 1);

        post
          .save()
          .then((post) => res.json(post))
          .catch((err) => res.status(404).json({ success: false }));
      })
      .catch((err) =>
        res.status(404).json({ nopostfound: "No post found!!!" })
      );
  }
);

module.exports = router;
