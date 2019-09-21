const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
let newsList = [];

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
  let locationAddress = (req.user.city) ? `&location.address=${req.user.city}&location.within=30km` : "";
  let todaysDateStr = `${todaysDate.getFullYear()}-${todaysDate.getMonth() +
    1}-${todaysDate.getDate()}T17%3A56%3A53Z`;
  let allInterestsStr = interests.join("+");
  const newsSources =
    "ars-technica,techcrunch,techradar,wired,engadget,reddit-r-all,next-big-future,mashable,gruenderszene";
  // additional sources: google-news,newsweek,bbc-news
  const requests = {};
  requests.newsCombined = `https://newsapi.org/v2/everything?q=${allInterestsStr}&sources=${newsSources}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY2}`;
  if (interests.length > 1) {
    interests.forEach((interest, index) => {
      requests[
        `news${index + 1}`
      ] = `https://newsapi.org/v2/everything?q=${interest}&sources=${newsSources}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY2}`;
    });
  }
  const eventsCall = `https://www.eventbriteapi.com/v3/events/search/?q=${interests[0]}${locationAddress}&start_date.range_start=${todaysDateStr}&start_date.range_end=2019-12-31T17%3A56%3A53Z&token=${process.env.EVENTBRITE_API_TOKEN}`;

  // https://www.eventbriteapi.com/v3/events/search/?q=javascript&location.address=&location.within=30km&start_date.range_start=2019-09-15T17%3A56%3A53Z&start_date.range_end=2019-12-31T17%3A56%3A53Z&token=SA2FSDVWX2F7NYE4PBBE

  let promises = Object.values(requests).map(val => axios.get(val));

  axios.get(eventsCall)
    .then(response => {
      const eventsResp = response.data.events;
      if (eventsResp.length) {
        for (let i = 0; i < eventsResp.length; i++) {
          let eToPush = formatTheEvent(eventsResp[i]);
          eventsList.push(eToPush);
        }
      }
      Promise.all([...promises])
        .then(responses => {
          responses.forEach(response => newsList = newsList.concat(response.data.articles));
          let counter = 0;
          if (eventsList.length) {
            newsList.forEach((item, index) => {
              if (index % 5 === 0 && counter < eventsList.length) {
                newsList.splice(index, 0, eventsList[counter]);
                counter++
              }
            })
          }
          newsList = formatNews(newsList, req.user.pinnedContent);

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
    .then(found => {})
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

// outside functions to make the route callls shorter

const formatNews = (newsListToFormat, listOfPinnedItems) => {
  newsListToFormat.forEach(item => {
    if (item) {
      if (item.content) item.content = item.content.slice(0, item.content.length - 20) + ' ...(see more)';
      item.contentId = `${item.title}${item.publishedAt}`;
      if (!item.urlToImage) item.urlToImage = '/images/default-news-pic.jpeg';
      item.publishedAt = item.publishedAt.slice(0, 10);
      if (checkContentId(item, listOfPinnedItems)) item.pinned = true;
    }
  })
  return newsListToFormat;
}

const checkContentId = (item, array) => {
  let idPresent = false;
  array.forEach(arrayItem => {
    if (arrayItem.contentId === item.contentId) idPresent = true;
  });
  return idPresent;
};

const formatTheEvent = rawEventData => {
  let eToPush = {};
  eToPush.source = {
    name: 'Event'
  }
  eToPush.title = rawEventData.name.text;
  eToPush.description = rawEventData.description.text;
  eToPush.url = rawEventData.url;
  eToPush.urlToImage = (rawEventData.logo) ? rawEventData.logo.url : '/images/default-news-pic.jpeg';
  eToPush.content = `${rawEventData.summary.slice(0,200)} ...(see more)` || '';
  eToPush.publishedAt = rawEventData.start.local;
  eToPush.source.event = true;
  eToPush.contentId = `${rawEventData.name.text}${rawEventData.published}`

  return eToPush;
}

module.exports = router;