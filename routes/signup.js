const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/advanced", (req, res, next) => {
  res.render("signup/advanced", {
    user: req.user,
    layout: false
  });
});

router.post("/advanced", (req, res, next) => {
  const {
    level,
    interests,
    // githubUrl,
    // city
  } = req.body;
  // console.log(Array.from(interests));
  // const interests = req.body.interests;
  // const mentorship = req.body.mentorship || "no";
  const user = req.user._id;

<<<<<<< HEAD
  User.findByIdAndUpdate({ _id: user }, { level, interests, githubUrl, city })
=======
  User.findByIdAndUpdate({
      _id: user
    }, {
      level,
      interests,
      // mentorship,
      // githubUrl,
      // city
    })
>>>>>>> signup-improve
    .then(user => {
      //   res.redirect('/books')
      res.redirect("/signup/final"); // book._id === req.params.bookId
    })
    .catch(err => {
      next(err);
    });
});

router.get("/final", (req, res, next) => {
  console.log(req.params);
  res.render("signup/final", {
    user: req.user,
    layout: false
  });
});

router.post("/final", (req, res, next) => {
  const {
    githubUrl,
    city
  } = req.body;
  const user = req.user._id;
  User.findByIdAndUpdate({
      _id: user
    }, {
      githubUrl,
      city
    })
    .then(user => {
      res.redirect(`/user/feed`);
    })
    .catch(err => {
      next(err);
    });
})

module.exports = router;