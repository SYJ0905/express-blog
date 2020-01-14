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

/* GET dashboard/archives page. */
router.get('/dashboard/archives', (req, res) => {
  res.render('dashboard/archives', { title: 'Express' });
});

/* GET dashboard/article page. */
router.get('/dashboard/article', (req, res) => {
  res.render('dashboard/article', { title: 'Express' });
});

/* GET dashboard/categories page. */
router.get('/dashboard/categories', (req, res) => {
  res.render('dashboard/categories', { title: 'Express' });
});

/* GET dashboard/signup page. */
router.get('/dashboard/signup', (req, res) => {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
