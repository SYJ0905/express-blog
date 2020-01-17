const express = require('express');
const moment = require('moment');
const firebaseAdmin = require('../plugins/firebase-admin');

const router = express.Router();

const categoriesRef = firebaseAdmin.ref('/categories/');
const articlesRef = firebaseAdmin.ref('/articles/');

/* GET dashboard/archives?status page. */
router.get('/archives', (req, res) => {
  const articleStatus = req.query.status || 'public';
  const categories = [];
  categoriesRef.once('value')
    .then((dataSnapshot) => {
      dataSnapshot.forEach((dataSnapshotChild) => {
        categories.push(dataSnapshotChild.val());
      });
      return articlesRef.orderByChild('update_time').once('value');
    })
    .then((dataSnapshot) => {
      const articles = [];
      dataSnapshot.forEach((dataSnapshotChild) => {
        if (articleStatus === dataSnapshotChild.val().status) {
          articles.push(dataSnapshotChild.val());
        }
      });
      articles.reverse();
      res.render('dashboard/archives', {
        title: 'Express',
        categories,
        articles,
        moment,
        articleStatus,
      });
    })
    .catch((error) => {
      console.log('渲染文章頁面失敗', error.message);
      res.redirect('/');
    });
});

/* GET /article/create 新增文章頁面 */
router.get('/article/create', (req, res) => {
  categoriesRef.once('value')
    .then((dataSnapshot) => {
      const categories = dataSnapshot.val();
      const article = {};
      res.render('dashboard/article', {
        title: 'Express',
        categories,
        article,
      });
    })
    .catch((error) => {
      console.log('渲染新增文章頁面失敗', error.message);
      res.redirect('/');
    });
});

/* GET /article/:id 特定文章頁面 */
router.get('/article/:id', (req, res) => {
  const id = req.params.id;
  let categories = {};
  categoriesRef.once('value')
    .then((dataSnapshot) => {
      categories = dataSnapshot.val();
      return articlesRef.child(id).once('value');
    })
    .then((dataSnapshot) => {
      const article = dataSnapshot.val();
      res.render('dashboard/article', {
        title: 'Express',
        categories,
        article,
      });
    })
    .catch((error) => {
      console.log('取得特定文章頁面失敗', error.message);
    });
});


/* POST API /article/create 新增文章 */
router.post('/article/create', (req, res) => {
  const articleRef = articlesRef.push();
  const data = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    status: req.body.status,
    id: articleRef.key,
    update_time: Math.floor(Date.now() / 1000),
  };
  articleRef.set(data)
    .then(() => {
      res.redirect(`/dashboard/article/${data.id}`);
    })
    .catch((error) => {
      console.log('新增文章失敗', error.message);
    });
});

/* POST API /article/update/:id 更新文章 */
router.post('/article/update/:id', (req, res) => {
  const id = req.params.id;
  const data = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    status: req.body.status,
    id,
    update_time: Math.floor(Date.now() / 1000),
  };
  articlesRef.child(id).update(data)
    .then(() => {
      res.redirect(`/dashboard/article/${id}`);
    })
    .catch((error) => {
      console.log('更新特定文章失敗', error.message);
    });
});

/* GET /dashboard/categories 文章分類頁面 */
router.get('/categories', (req, res) => {
  const message = req.flash('info');
  categoriesRef.once('value')
    .then((dataSnapshot) => {
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

/* POST API /categories/create 新增文章分類 */
router.post('/categories/create', (req, res) => {
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  const data = {
    name: req.body.name,
    path: req.body.path,
    id: key,
  };
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
    .then((dataSnapshot) => {
      if (dataSnapshot.val() !== null) {
        req.flash('info', '已有相同路徑');
        res.redirect('/dashboard/categories');
      } else {
        categoryRef.set(data)
          .then(() => {
            res.redirect('/dashboard/categories');
          })
          .catch((error) => {
            console.log('新增文章分類失敗', error.message);
            res.redirect('/dashboard/categories');
          });
      }
    });
});

/* POST API /categories/delete/:id 刪除文章分類 */
router.post('/categories/delete/:id', (req, res) => {
  const id = req.params.id;
  categoriesRef.child(id).remove()
    .then(() => {
      req.flash('info', '欄位已刪除');
      res.redirect('/dashboard/categories');
    })
    .catch((error) => {
      console.log('刪除文章分類失敗', error.message);
      res.redirect('/dashboard/categories');
    });
});

module.exports = router;
