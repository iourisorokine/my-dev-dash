const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cron = require("cron");

router.get("/", async (req, res, next) => {
  const connections = req.user.connections;

  res.render("connections/connection-page", {
    connections,
    user: req.user,
    message: req.flash("message")
  });
});

router.post("/add", async (req, res, next) => {
  const connections = req.user.connections;
  const message = await checkConnections(req.user);
  req.flash("message", message);
  res.redirect("/connections");
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

const checkConnections = async (user, flash) => {
  // const random = await User.aggregate([{ $sample: { size: 1 } }]);
  const allLevels = [
    "novice",
    "beginner",
    "intermediate",
    "advanced",
    "senior"
  ];
  const levelArr = allLevels.indexOf(user.level);
  // console.log(levelArr);
  const query = {
    $match: {
      $and: [{ city: `${user.city}` }],
      $or: [
        { level: `${allLevels[levelArr]}` },
        { level: `${allLevels[levelArr - 1]}` },
        { level: `${allLevels[levelArr + 1]}` }
      ]
    }
  };
  const count = await User.aggregate([
    query,
    { $count: "matching_level_connections" }
  ]);
  console.log(count[0].matching_level_connections);
  console.log(user.connections.length);
  if (count[0].matching_level_connections === user.connections.length) {
    return "try again next week";
  }

  const random = await User.aggregate([query, { $sample: { size: 1 } }]);

  const randomUser = random[0];
  // console.log("User Level", randomUser.name);
  // console.log("Random User", randomUser.level, randomUser.name);

  console.log(user.connections.map(el => el._id));
  console.log(String(randomUser._id));
  const connectionsId = user.connections.some(el =>
    el._id.equals(randomUser._id)
  );

  user.connections.forEach(el => {
    if (el._id.equals(randomUser._id)) {
      console.log("found");
    } else {
      console.log("Not found");
    }
  });

  console.log(connectionsId);
  // while (!connectionsId)
  if (!connectionsId) {
    const updatedRandom = await User.findByIdAndUpdate(randomUser._id, {
      $addToSet: { connections: `${user._id}` }
    });
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { connections: `${randomUser._id}` }
      },
      { new: true }
    );
    return;
    // console.log("addedagaaaaain");
  } else {
    console.log("Not happening");
    await checkConnections(user);
  }
};

module.exports = router;
