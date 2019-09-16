const express = require('express');
const router = express.Router();


router.get('/feed', (req, res, next) => {
  res.render('user/feed');
});

router.get('/pinned', (req, res, next) => {
  res.render('user/pinned-content');
});

router.get('/profile', (req, res, next) => {
  res.render('user/profile');
});

module.exports = router;