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

const checkInterests = () => {
  return (req, res, next) => {
    if (!req.user.interests) {
      res.redirect("/profile", {
        user: req.user
        // message: 'Please select interests in order to have a feed'
      });
    } else {
      next();
    }
  };
};

// manages the nees feed from the news API
router.get("/feed", checkInterests(), (req, res, next) => {
  console.log(req.user.city);
  newsList = [];
  let eventsList = [];
  const interests = req.user.interests;
  let todaysDate = new Date();
  let todaysDateStr = `${todaysDate.getFullYear()}-${todaysDate.getMonth() +
    1}-${todaysDate.getDate()}T17%3A56%3A53Z`;
  let allInterestsStr = interests.join("+");
  const newsSources =
    "google-news,ars-technica,techcrunch,techradar,wired,bbc-news,engadget";
  const requests = {};
  requests.newsCombined = `https://newsapi.org/v2/everything?q=${allInterestsStr}&sources=${newsSources}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
  if (interests.length > 1) {
    interests.forEach((interest, index) => {
      requests[
        `news${index + 1}`
      ] = `https://newsapi.org/v2/everything?q=${interest}&sources=${newsSources}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;
    });
  }
  const eventsCall = `https://www.eventbriteapi.com/v3/events/search/?q=${interests[0]}&location.address=${req.user.city}&location.within=30km&start_date.range_start=${todaysDateStr}&start_date.range_end=2019-12-31T17%3A56%3A53Z&token=${process.env.EVENTBRITE_API_TOKEN}`;

  let promises = Object.values(requests).map(val => axios.get(val));

  axios.get(eventsCall)
    .then(response => {
      const eventsResp = response.data.events;
      console.log(eventsResp, eventsResp.length)
      if (eventsResp.length != 0) {
        for (let i = 0; i < eventsResp.length; i++) {
          let eToPush = {};
          eToPush.source = {
            name: 'Event'
          }
          eToPush.title = eventsResp[i].name.text;
          eToPush.description = eventsResp[i].description.text;
          eToPush.url = eventsResp[i].url;
          // console.log(eventsResp[i].logo);
          eToPush.urlToImage = (eventsResp[i].logo) ? eventsResp[i].logo.url : '/images/default-news-pic.jpeg';
          eToPush.publishedAt = eventsResp[i].published;
          eToPush.source.event = true;
          eToPush.contentId = `${eventsResp[i].name.text}${eventsResp[i].published}`
          eventsList.push(eToPush);
        }
      }
      Promise.all([...promises])
        .then(responses => {
          responses.forEach(response => newsList = newsList.concat(response.data.articles));
          let counter = 0;
          if (eventsList.length) {
            newsList.forEach((item, index) => {
              if (index % 5 === 0 && counter < 5) {
                newsList.splice(index, 0, eventsList[counter]);
                counter++
              }
            })
          }
          newsList.forEach(item => {
            if (item.content) item.content = item.content.slice(0, item.content.length - 20) + ' ...(see more)';
            item.contentId = `${item.title}${item.publishedAt}`;
            if (!item.urlToImage) item.urlToImage = '/images/default-news-pic.jpeg';
            item.publishedAt = item.publishedAt.slice(0, 10);
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
      // res.redirect("/user/feed");
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
      // res.redirect("/user/feed");
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