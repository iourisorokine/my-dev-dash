const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/user/feed', (req, res, next) => {
//   res.render('user/feed');
// });

// router.get('/user/pinned', (req, res, next) => {
//   res.render('user/pinned-content');
// });

// router.get('/user/profile', (req, res, next) => {
//   res.render('user/profile');
// });

module.exports = router;