const express = require("express");
const router = express.Router();
const User = require("../models/User");

// include CLOUDINARY:
const uploadCloud = require("../config/cloudinary");

router.get("/", (req, res, next) => {
  res.render("profile/profile-page", {
    user: req.user,
  });
});

router.get("/edit", (req, res, next) => {
  console.log(req.user);
  res.render("profile/edit", {
    user: req.user,
  });
});

router.post("/edit", uploadCloud.single("imagePath"), (req, res, next) => {
  const { email, level, githubUrl, bio } = req.body;
  const city = req.body.city.toLowerCase();
  const image = req.user.imagePath;
  const interests = req.body.interests || "javascript";
  const user = req.user._id;
  let imagePath = req.file ? req.file.url : req.user.imagePath;
  console.log("file url image: ", req.file);
  console.log("user image: ", req.user.imagePath);

  User.findByIdAndUpdate(
    {
      _id: user,
    },
    {
      email,
      city,
      level,
      githubUrl,
      interests,
      bio,
      imagePath,
    },
  )
    .then((user) => {
      //   res.redirect('/books')
      res.redirect(`/profile`); // book._id === req.params.bookId
    })
    .catch((err) => {
      next(err);
    });
});

// const booleanLang = interests => {
//   const languages = {
//     'javascript': false,
//     'node.js': false,
//     'java': false,
//     'python': false,
//     'bootstrap': false,
//     'react.js': false,
//     'php': false,
//     'ruby': false,
//     'front-end': false
//   }
//   interests.forEach(interest => {
//     if (interests.includes(interest)) {
//       languages[interest] = true;
//     }
//   })
//   return languages;
// }

module.exports = router;
