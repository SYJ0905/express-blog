const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

/* GET post page. */
router.get('/post', (req, res) => {
  res.render('post', { title: 'Express' });
});

/* GET dashboard/signup page. */
router.get('/dashboard/signup', (req, res) => {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
