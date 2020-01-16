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
  const message = req.flash('info');
  categoriesRef.once('value')
    .then((dataSnapshot) => {
      console.log('取得文章分類成功');
      const categories = dataSnapshot.val();
      res.render('dashboard/categories', {
        title: 'Express',
        categories,
        message,
        hasInfo: message.length > 0,
      });
    })
    .catch((error) => {
      console.log('取得文章分類失敗', error.message);
      res.redirect('/dashboard/categories');
    });
});

// 新增文章分類 API
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
      console.log('新增文章分類成功');
      res.redirect('/dashboard/categories');
    })
    .catch((error) => {
      console.log('新增文章分類失敗', error.message);
      res.redirect('/dashboard/categories');
    });
});

// 刪除文章分類 API
router.post('/categories/delete/:id', (req, res) => {
  const id = req.params.id;
  categoriesRef.child(id).remove()
    .then(() => {
      console.log('刪除文章分類成功');
      req.flash('info', '欄位已刪除');
      res.redirect('/dashboard/categories');
    })
    .catch((error) => {
      console.log('刪除文章分類失敗', error.message);
      res.redirect('/dashboard/categories');
    });
});

module.exports = router;
