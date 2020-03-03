const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/advanced", (req, res, next) => {
  console.log("here");
  res.render("signup/advanced", {
    user: req.user,
    layout: false
  });
});

router.post("/advanced", (req, res, next) => {
  console.log("hallo");
  const {
    level,
    interests
    // githubUrl,
    // city
  } = req.body;
  // console.log(Array.from(interests));
  // const interests = req.body.interests;
  // const mentorship = req.body.mentorship || "no";
  const user = req.user._id;

  User.findByIdAndUpdate(user, {
    level,
    interests
    // mentorship,
    // githubUrl,
    // city
  })
    .then(user => {
      //   res.redirect('/books')
      res.redirect("/signup/final"); // book._id === req.params.bookId
    })
    .catch(err => {
      next(err);
    });
});

router.get("/final", (req, res, next) => {
  console.log("final");
  // console.log(req.params);
  res.render("signup/final", {
    user: req.user,
    layout: false
  });
});

router.post("/final", (req, res, next) => {
  console.log("here in final");
  const { githubUrl, city } = req.body;

  User.findByIdAndUpdate(req.user._id, { ...req.body })
    .then(() => {
      res.redirect("/user/feed");
    })
    .catch(err => console.log(err));

  // User.findByIdAndUpdate(user, {
  //   githubUrl,
  //   city
  // })
  //   .then(user => {
  //     res.redirect(`/user/feed`);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
});

module.exports = router;
