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

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", {
    layout: false
  });
});

router.post("/signup", (req, res, next) => {
  // console.log(req.body.mento);
  // const email = req.body.email;
  const { name, email, city, level, github, password } = req.body;
  // console.log(Array.from(interests));
  const interests = Array.from(req.body.interests);
  const mentorship = req.body.mentorship || "no";
  console.log(
    name,
    email,
    city,
    level,
    mentorship,
    interests,
    github,
    password
  );
  // const password = req.body.password;
  if (email === "" || password === "" || mentorship.length === 0) {
    res.render("auth/signup", { message: "Indicate email and password" });
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
          message: "The email already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashPass,
        city,
        level,
        mentorship,
        interests,
        github
      });

      newUser
        .save()
        .then(() => {
          res.redirect("/");
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
