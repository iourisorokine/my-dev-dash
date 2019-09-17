const express = require("express");
const router = express.Router();

const loginCheck = () => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/user/feed");
    }
  };
};

/* GET home page */
router.get("/", loginCheck(), (req, res, next) => {
  res.render("index", {
    layout: false
  });
});

module.exports = router;
