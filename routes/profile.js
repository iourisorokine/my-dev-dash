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

router.post("/edit", uploadCloud.single("imagePath"), (req, res, next) => {
  const {
    email,
    level,
    githubUrl,
    bio
  } = req.body;
  console.log('user image: ', req.user.imagePath);
  // const title = req.body.title;
  // const description = req.body.description;
  // const author = req.body.author;
  // const rating = req.body.rating;
  // const mentorship = req.body.mentorship || "no";
  const city = req.body.city.toLowerCase();
  const interests = req.body.interests || "javascript";
  const user = req.user._id;
  let imagePath = (req.file) ? req.file.url : req.user.imagePath;
  console.log('file url image: ', req.file);
  console.log('user image: ', req.user.imagePath);


  User.findByIdAndUpdate({
      _id: user
    }, {
      email,
      city,
      level,
      githubUrl,
      interests,
      bio,
      imagePath
    })
    .then(user => {
      //   res.redirect('/books')
      res.redirect(`/profile`); // book._id === req.params.bookId
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;