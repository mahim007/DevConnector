const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const validateProfieInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//load profile model
const Profile = require("../../models/Profile");

// load user model
const User = require("../../models/User");
const e = require("express");
const profile = require("../../validation/profile");

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

        console.log("profile found: ", profile);
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
    if (req.body.githubUserName)
      profileFields.githubUserName = req.body.githubUserName;

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
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    console.log("profile fields: ", profileFields);
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        console.log("profile should be updated: ", profile);
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
            .then((profile) => res.json(profile))
            .catch((err) => res.status(404).json(err));
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
                  .catch((err) => res.status(404).json(err));
              }
            })
            .catch((err) => res.status(404).json(err));
        }
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   POST /api/profile/experience
// @desc    add experince to profile
// @access  private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const { errors, isValid } = validateExperienceInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      profile.experience.unshift(newExp);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => res.status(404).json(err));
    });
  }
);

// @route   POST /api/profile/experience
// @desc    add experince to profile
// @access  private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const { errors, isValid } = validateEducationInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      profile.education.unshift(newEdu);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => res.status(404).json(err));
    });
  }
);

// @route   DELETE /api/profile/experience/:expId
// @desc    delete experince from profile
// @access  private

router.delete(
  "/experience/:expId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.expId);

        profile.experience.splice(removeIndex, 1);
        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => res.status(404).json(err));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   DELETE /api/profile/education/:eduId
// @desc    delete education from profile
// @access  private

router.delete(
  "/education/:eduId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.eduId);

        profile.education.splice(removeIndex, 1);
        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => res.status(404).json(err));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route   DELETE /api/profile
// @desc    delete profile
// @access  private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
