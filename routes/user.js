const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");

let newsList = [];
checkContentId = (item, array) => {
  let idPresent = false;
  array.forEach(arrayItem => {
    if (arrayItem.contentId === item.contentId) idPresent = true;
  });
  return idPresent;
};

// manages the nees feed from the news API
router.get("/feed", (req, res, next) => {
  const interests = req.user.interests;

  let todaysDate = new Date();
  let interestsStr = interests.reduce((acc, val, index) => {
    if (index < interests.length - 1) return acc + val + "+";
    return acc + val;
  }, "");
  const newsReqCombined = `https://newsapi.org/v2/everything?q=${interestsStr}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
  // const eventbriteCombined = `https://www.eventbriteapi.com/v3/events/search/?token=${process.env.EVENTBRITE_API_KEY}&q=${interestsStr}`;
  // https://www.eventbriteapi.com/v3/events/search/?q=react&location.address=${req.user.city}&location.within=60km&location.latitude=14.58333&location.longitude=121&start_date.range_start=${todaysDate}&token=${process.env.EVENTBRITE_API_KEY}

  axios.get(newsReqCombined).then(response => {
    newsList = response.data.articles;
    newsList.forEach(item => {
      item.contentId = `${item.title}${item.publishedAt}`;
      if (checkContentId(item, req.user.pinnedContent)) item.pinned = true;
    });
    // console.log(newsList);
    // newsList = [...news,...newsList]
    res.render("user/feed", {
      newsList,
      user: req.user
    });
  });
});

// pin content - not working
router.post("/pin/:itemNb", (req, res, next) => {
  const newPinnedItem = newsList[req.params.itemNb];
  newPinnedItem.pinned = true;
  const currentContent = req.user.pinnedContent;
  currentContent.push(newPinnedItem);
  User.findByIdAndUpdate(req.user._id, {
    pinnedContent: currentContent
  })
    .then(found => {
      res.redirect("/user/feed");
    })
    .catch(err => {
      next(err);
    });
});

router.post("/remove/:itemNb", (req, res, next) => {
  const itemToRemove = newsList[req.params.itemNb];
  let currentContent = req.user.pinnedContent;
  currentContent = currentContent.filter(
    item => item.contentId !== itemToRemove.contentId
  );
  User.findByIdAndUpdate(req.user._id, {
    pinnedContent: currentContent
  })
    .then(found => {
      res.redirect("/user/feed");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/pinned", (req, res, next) => {
  const pinnedContent = req.user.pinnedContent;
  res.render("user/pinned-content", {
    pinnedContent,
    user: req.user
  });
});

router.post("/pinned/remove/:itemNb", (req, res, next) => {
  let currentContent = req.user.pinnedContent;
  currentContent.splice(req.params.itemNb, 1);
  User.findByIdAndUpdate(req.user._id, {
    pinnedContent: currentContent
  })
    .then(found => {
      res.redirect("/user/pinned");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
