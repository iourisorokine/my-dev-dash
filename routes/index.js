const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.user;
  if (user) {
<<<<<<< HEAD
    res.redirect("/user/feed", { user });
=======
    res.redirect("/user/feed");
>>>>>>> f1d2b99f2957a2e1aea8a59580eda590e2c57863
  }
  res.render("index", {
    layout: false
  });
});

module.exports = router;
