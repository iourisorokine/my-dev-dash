const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cron = require("cron");

router.get("/", (req, res, next) => {
  const connections = req.user.connections;
  console.log(connections);
  res.render("connections/connection-page", {
    connections,
    user: req.user
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

checkConnections = () => {
  // User.find().then(usersDb => {
  //   const newArray = usersDb.slice()
  //   const {connections} = req.user
  //   newArray.forEach(el => {
  //     if(connections.includes(el._id)) return;
  //     else
  //   })
  // });
};

module.exports = router;
