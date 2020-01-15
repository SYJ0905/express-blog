const express = require('express');
const firebaseAdmin = require('../plugins/firebase-admin');

const router = express.Router();

const categoriesRef = firebaseAdmin.ref('/categories/');

/* GET dashboard/archives page. */
router.get('/archives', (req, res) => {
  res.render('dashboard/archives', { title: 'Express' });
});

/* GET dashboard/article page. */
router.get('/article', (req, res) => {
  res.render('dashboard/article', { title: 'Express' });
});

/* GET dashboard/categories page. */
router.get('/categories', (req, res) => {
  categoriesRef.once('value')
    .then((dataSnapshot) => {
      const categories = dataSnapshot.val();
      res.render('dashboard/categories', {
        title: 'Express',
        categories,
      });
    });
});

router.post('/categories/create', (req, res) => {
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  const data = {
    name: req.body.name,
    path: req.body.path,
    id: key,
  };
  categoryRef.set(data)
    .then(() => {
      res.redirect('/dashboard/categories');
    });
});

module.exports = router;
