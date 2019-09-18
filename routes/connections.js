const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cron = require("cron");

router.get("/", (req, res, next) => {
  const connections = req.user.connections;
  // checkConnections();
  // console.log("test: ", checkConnections(req.user));
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

/* const checkConnections = async user => {
  // const random = await User.aggregate([{ $sample: { size: 1 } }]);
  const allLevels = [
    "novice",
    "beginner",
    "intermediate",
    "advanced",
    "senior"
  ];
  const levelArr = allLevels.indexOf(user.level);
  console.log(levelArr);
  const random = await User.aggregate([
    {
      $match: {
        $and: [{ city: `${user.city}` }],
        $or: [
          { level: `${allLevels[levelArr]}` },
          { level: `${allLevels[levelArr - 1]}` },
          { level: `${allLevels[levelArr + 1]}` }
        ]
      }
    },
    { $sample: { size: 1 } }
  ]);

  // User.aggregate([
  //   { $match: { city: "paris" } },
  //   { $sample: { size: 1 } }
  // ], function (err, docs) {
  //   console.log(docs);
  // });

  const randomUser = random[0];
  console.log("User Level", user.level);
  console.log("Random User", randomUser.level, randomUser.name);

  const connectionsId = user.connections.some(id => {
    if (id.name === randomUser.name) {
      return true;
    }
  });

  const sameCity = user.connections.some(id => {
    if (id.city === randomUser.city) {
      return true;
    }
  });

  const sameLevel = user.connections.some(id => {
    if (id.level === randomUser.level) {
      return true;
    }
  });

  // const userCity =
  if (!connectionsId || !sameCity || !sameLevel) console.log("Not good enough");
  else console.log("Maybe get connected");
  console.log(randomUser.city);
}; */

module.exports = router;
