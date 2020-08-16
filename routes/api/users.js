const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");
// @route   GET /api/users/test
// @desc    Test route for users
// @access  public

router.get("/test", (req, res) => res.json({ msg: "users work" }));

// @route   GET /api/users/register
// @desc    Register a user
// @access  public

router.post("/register", (req, res) => {
    console.log('request received at : /register');
    console.log(`data: ${req.body.email}`);
    // User.find( { emai: req.body.email }, function(err, result) {
    //   if (err) {
    //     res.send(err);
    //   } else {
    //     res.send(result);
    //   }
    // });
    User.findOne({email: req.body.email})
    .then((user) => console.log(`data found! ${user}`));

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "email already exists!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      console.log(`new user: ${newUser}`);

      bcrypt.genSalt(10, (err, salt) => {
        console.log(`salt created: ${salt}`)
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          console.log(`hash created: ${hash}`);
          if (err) {
            newUser.password = hash;
            newUser.save(function(err, user){
              if(err){
                  console.log(err);
              } else {
                  console.log(user);
              }
          })
            // newUser
            //   .save()
            //   .then((user) => res.json(user))
            //   .catch((err) => console.log(err));
          }
        });
      });
    }
  });
});

module.exports = router;
