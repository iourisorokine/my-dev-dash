const express = require("express");
const router = express.Router();
const axios = require("axios");

// manages the nees feed from the news API
let todaysDate = new Date();
let interests = ["react", "javascript"];
let interestsStr = interests.reduce((acc, val, index) => {
  if (index < interests.length - 1) return acc + val + "+";
  return acc + val;
}, "");
const requestUrl = `https://newsapi.org/v2/everything?q=${interestsStr}&language=en&from=${todaysDate}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`;

router.get("/feed", (req, res, next) => {
  axios.get(requestUrl).then(response => {
    const newsList = response.data.articles;
    console.log(interestsStr);
    res.render("user/feed", {
      newsList,
      user: req.user
    });
  });
});

router.get("/pinned", (req, res, next) => {
  res.render("user/pinned-content");
});

router.get("/profile", (req, res, next) => {
  res.render("user/profile");
});

module.exports = router;