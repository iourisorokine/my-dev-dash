const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require('../models/User');

let newsList = [];

// manages the nees feed from the news API
router.get('/feed', (req, res, next) => {
  const interests = req.user.interests;

  let todaysDate = new Date();
  let interestsStr = interests.reduce((acc, val, index) => {
    if (index < interests.length - 1) return acc + val + '+';
    return acc + val;
  }, "")
  const newsReqCombined = `https://newsapi.org/v2/everything?q=${interestsStr}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
  // const eventbriteCombined = `https://www.eventbriteapi.com/v3/events/search/?token=${process.env.EVENTBRITE_API_KEY}&q=${interestsStr}`;
  // https://www.eventbriteapi.com/v3/events/search/?q=react&location.address=${req.user.city}&location.within=60km&location.latitude=14.58333&location.longitude=121&start_date.range_start=${todaysDate}&token=${process.env.EVENTBRITE_API_KEY}


  axios.get(newsReqCombined)
    .then(response => {
      newsList = response.data.articles;
      // newsList = [...news,...newsList]
      res.render('user/feed', {
        newsList,
        user: req.user
      });
    })
});

// pin content - not working
router.post("/pin/:itemNb", (req, res, next) => {
  const newPinnedItem = newsList[req.params.itemNb];
  newPinnedItem.contentId = `${newPinnedItem.title}${newPinnedItem.publishedAt}`;
  const currentContent = req.user.pinnedContent;
  let duplicate = false;
  currentContent.forEach(item => {
    if (item.contentId === newPinnedItem.contentId) duplicate = true;
  });
  if (!duplicate) currentContent.push(newPinnedItem);


  User.findByIdAndUpdate(req.user._id, {
      pinnedContent: currentContent
    })
    .then(found => {
      res.redirect('/user/feed');
    })
    .catch(err => {
      next(err)
    })
})

router.get("/pinned", (req, res, next) => {
  res.render("user/pinned-content", {
    user: req.user
  });
});

router.get("/profile", (req, res, next) => {
  res.render("user/profile", {
    user: req.user
  });
});

module.exports = router;