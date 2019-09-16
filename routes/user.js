const express = require('express');
const router = express.Router();
const axios = require('axios');



// manages the nees feed from the news API
let todaysDate = new Date()


router.get('/feed', (req, res, next) => {

  //declare variables that manage the api calls according to interests
  let newsList;
  let todaysDate = new Date()
  const interests = req.user.interests;
  let interestsStr = interests.reduce((acc, val, index) => {
    if (index < interests.length - 1) return acc + val + '+';
    return acc + val;
  }, "")
  const requestUrl = `https://newsapi.org/v2/everything?q=${interestsStr}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;


  axios.get(requestUrl)
    .then(response => {
      const newsList = response.data.articles;
      // topicsList = topicsList.concat(newsList)
      // newsList = [...news,...newsList]
      res.render('user/feed', {
        newsList
      });
    })
});

router.get('/pinned', (req, res, next) => {
  res.render('user/pinned-content');
});

router.get('/profile', (req, res, next) => {
  res.render('user/profile');
});

module.exports = router;