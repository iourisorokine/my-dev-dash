const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    message: req.flash("error"),
    layout: false
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// Github authentification routes
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/user/feed",
    failureRedirect: "/auth/login"
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", {
    layout: false
  });
});

router.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;

  if (email === "" || password === "" || name.length === 0) {
    res.render("auth/signup", {
      message: "Please fill out the form",
      layout: false
    });
    return;
  }

  User.findOne(
    {
      email
    },
    "email",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          message: "The email already exists",
          layout: false
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashPass
      });

      newUser
        .save()
        .then(user => {
          req.login(user, function(err) {
            if (err) {
              return next(err);
            }
            return res.redirect("/signup/advanced");
          });
        })
        .catch(err => {
          console.log(err);
          res.render("auth/signup", {
            message: "Something went wrong"
          });
        });
    }
  );
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
