const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');
// all account posts
router.get('/',withAuth, async (req, res) => {
    try {
      // Get all posts and JOIN with user data
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      });
  
      // Serialize data so the template can read it
      const posts = postData.map((post) => post.get({ plain: true }));
  
      // Pass serialized data and session flag into template
      res.render('account', { 
        posts, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
// get one post to update
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ['id', 'title', 'content', 'created'],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
            {
                model: Comment,
                attributes: ['id', 'comment', 'postId', 'userId', 'created'],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
        ],
    })
     .then ((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({ message: 'This user has no posts'});
            return;
        }
        const post = dbPostData.get({ plain: true });
        res.render('edit-post', { post, loggedIn: true, username: req.session.username });
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});
// get new post
router.get('/new', withAuth, (req, res) => {
    res.render('new-post', { username: req.session.username });
});

module.exports = router;