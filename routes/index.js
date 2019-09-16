const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.user;
  if (user) {
    res.redirect("/user/feed", {
      user: user
    });
  }
  res.render("index", {
    layout: false
  });
});

module.exports = router;