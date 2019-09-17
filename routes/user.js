const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require('../models/User');

let newsList = [];

checkContentId = (item, array) => {
  let idPresent = false
  array.forEach(arrayItem => {
    if (arrayItem.contentId === item.contentId) idPresent = true;
  })
  return idPresent;
}

// manages the nees feed from the news API
router.get('/feed', (req, res, next) => {

  newslist = [];
  const interests = req.user.interests;
  let todaysDate = new Date();
  let allInterestsStr = interests.join('+')
  const requests = {};
  requests.newsCombined = `https://newsapi.org/v2/everything?q=${allInterestsStr}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
  interests.forEach((interest, index) => {
    requests[`news${index+1}`] = `https://newsapi.org/v2/everything?q=${interest}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
  })

  // const eventbriteCombined = `https://www.eventbriteapi.com/v3/events/search/?token=${process.env.EVENTBRITE_API_KEY}&q=${}`;
  // https://www.eventbriteapi.com/v3/events/search/?q=react&location.address=${req.user.city}&location.within=60km&location.latitude=14.58333&location.longitude=121&start_date.range_start=${todaysDate}&token=${process.env.EVENTBRITE_API_KEY}

  let promises = Object.values(requests).map(val => axios.get(val));

  Promise.all([...promises])
    .then(responses => {
      responses.forEach(response => newsList = newsList.concat(response.data.articles));
      newsList.forEach(item => {
        item.contentId = `${item.title}${item.publishedAt}`
        if (checkContentId(item, req.user.pinnedContent)) item.pinned = true;
      })
      res.render('user/feed', {
        newsList,
        user: req.user
      });
    })
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
      res.redirect('/user/feed');
    })
    .catch(err => {
      next(err)
    })
})

router.post("/remove/:itemNb", (req, res, next) => {
  const itemToRemove = newsList[req.params.itemNb];
  let currentContent = req.user.pinnedContent;
  currentContent = currentContent.filter(item => item.contentId !== itemToRemove.contentId);
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
      res.redirect('/user/pinned');
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router;