const express = require("express");
const router = express.Router();
const User = require("../models/User");

// include CLOUDINARY:
const uploadCloud = require("../config/cloudinary");

router.get("/", (req, res, next) => {
  res.render("profile/profile-page", {
    user: req.user
  });
});

router.get("/edit", (req, res, next) => {
  res.render("profile/edit", {
    user: req.user
  });
});

router.post("/edit", (req, res, next) => {
  const { email, level, githubUrl } = req.body;
  // const title = req.body.title;
  // const description = req.body.description;
  // const author = req.body.author;
  // const rating = req.body.rating;
  // const mentorship = req.body.mentorship || "no";
  const city = req.body.city.toLowerCase();
  const interests = req.body.interests || "javascript";
  const user = req.user._id;

  User.findByIdAndUpdate(
    { _id: user },
    { email, city, level, githubUrl, interests }
  )
    .then(user => {
      //   res.redirect('/books')
      res.redirect(`/profile`); // book._id === req.params.bookId
    })
    .catch(err => {
      next(err);
    });
});

router.get("/upload", (req, res, next) => {
  res.render("profile/upload", { user: req.user });
});

router.post("/upload", uploadCloud.single("imagePath"), (req, res, next) => {
  // console.log('file is: ', req.file)
  const user = req.user._id;
  const imagePath = req.file.url;
  console.log(req.file);
  User.findByIdAndUpdate({ _id: user }, { imagePath })
    .then(found => {
      res.redirect("/profile");
    })
    .catch(err => console.log(err));
});

module.exports = router;
