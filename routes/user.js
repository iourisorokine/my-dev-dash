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
router.get('/feed', (req, res, next) => {

  newsList = [];
  let eventsList = [];
  const interests = req.user.interests;
  let todaysDate = new Date();
  let todaysDateStr = `${todaysDate.getFullYear()}-${todaysDate.getMonth()+1}-${todaysDate.getDate()}T17%3A56%3A53Z`;
  let allInterestsStr = interests.join('+')
  const requests = {};
  requests.newsCombined = `https://newsapi.org/v2/everything?q=${allInterestsStr}&language=en&from=${todaysDate.toDateString()}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
  interests.forEach((interest, index) => {
    requests[`news${index+1}`] = `https://newsapi.org/v2/everything?q=${interest}&language=en&from=${todaysDate.toDateString()}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
  })

  const eventsCall = `https://www.eventbriteapi.com/v3/events/search/?q=react&location.within=10km&location.latitude=52.52437&location.longitude=13.41053&start_date.range_start=${todaysDateStr}&start_date.range_end=2019-10-31T17%3A56%3A53Z&token=${process.env.EVENTBRITE_API_TOKEN}`;

  let promises = Object.values(requests).map(val => axios.get(val));

  axios.get(eventsCall)
    .then(response => {
      const eventsResp = response.data.events;
      for (let i = 0; i < 5; i++) {
        let eToPush = {};
        eToPush.source = {
          name: 'Event'
        }
        eToPush.title = eventsResp[i].name.text;
        eToPush.description = eventsResp[i].description.text;
        eToPush.url = eventsResp[i].url;
        eToPush.urlToImage = eventsResp[i].logo.url;
        eToPush.publishedAt = eventsResp[i].published;
        eToPush.source.event = true;
        eToPush.contentId = `${eventsResp[i].name.text}${eventsResp[i].published}`
        eventsList.push(eToPush);
      }
      Promise.all([...promises])
        .then(responses => {
          responses.forEach(response => newsList = newsList.concat(response.data.articles));
          let counter = 0;
          newsList.forEach((item, index) => {
            if (index % 5 === 0 && counter < 5) {
              newsList.splice(index, 0, eventsList[counter]);
              counter++
            }
          })
          newsList.forEach(item => {
            item.contentId = `${item.title}${item.publishedAt}`
            if (checkContentId(item, req.user.pinnedContent)) item.pinned = true;
          })
          res.render('user/feed', {
            newsList,
            user: req.user
          })

        }).catch(err => {
          console.log(err)
        })
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