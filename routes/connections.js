const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cron = require("cron");

router.get("/", (req, res, next) => {
  User.find().then(userDB => {
    res.render("connections/connection-page", {
      userList: userDB,
      user: req.user
    });
    // res.render("books", { booksList: books });
  });
});

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  User.findById(userId).then(userDB => {
    console.log(userDB.name);
    res.render("connections/individual-connection", {
      indiUser: userDB,
      user: req.user
    });
  });
});
// const job = cron.job("* * * * *", () => console.log("Message every minute"));
// job.start();

// checkConnections = () => {
//   User.find().then(user => {
//     res.render("books", { booksList: books });
//   });
// };

module.exports = router;
