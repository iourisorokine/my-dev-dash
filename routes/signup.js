const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/advanced", (req, res, next) => {
  res.render("signup/process", { user: req.user });
});

router.post("/advanced", (req, res, next) => {
  const { level, interests, githubUrl, city } = req.body;
  // console.log(Array.from(interests));
  // const interests = req.body.interests;
  const mentorship = req.body.mentorship || "no";
  const user = req.user._id;

  User.findByIdAndUpdate(
    { _id: user },
    { level, interests, mentorship, githubUrl, city }
  )
    .then(user => {
      //   res.redirect('/books')
      res.redirect(`/profile`); // book._id === req.params.bookId
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
