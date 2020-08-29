const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateProfieInput = require("../../validation/profile");

//load profile model
const Profile = require("../../models/Profile");

// load user model
const User = require("../../models/User");
const e = require("express");

// @route   GET /api/profile/test
// @desc    Test route for profile
// @access  public

router.get("/test", (req, res) => res.json({ msg: "profile work" }));

// @route   GET /api/profile
// @desc    get current user's profile
// @access  private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch((err) => console.log(err));
  }
);

// @route   GET /api/profile/handle/:handle
// @desc    get profile by handle
// @access  public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// @route   GET /api/profile/user/:userId
// @desc    get profile by userId
// @access  public

router.get("/user/:userId", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.userId })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// @route   GET /api/profile/all
// @desc    get all profiles
// @access  public

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "There are no profiles" }));
});

// @route   POST /api/profile
// @desc    create or edit user's profile
// @access  private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);
    const { errors, isValid } = validateProfieInput(req.body);
    if (!isValid) {
      console.log(`invalid: ${errors}`);
      return res.status(400).json(errors);
    }

    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // skills - split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.insatagram)
      profileFields.social.insatagram = req.body.insatagram;

    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
            .then((profile) => res.json(profile))
            .catch((err) => console.log(err));
        } else {
          Profile.findOne({ handle: req.body.handle })
            .then((profile) => {
              if (profile) {
                errors.handle = `handle ${req.body.handle} aleady exists`;
                res.status(400).json(errors);
              } else {
                new Profile(profileFields)
                  .save()
                  .then((profile) => res.json(profile))
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
