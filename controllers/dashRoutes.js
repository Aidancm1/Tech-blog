const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');
// all account posts
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            userId: req.session.userId
        },
        attributes: ['id', 'content', 'title', 'created'],
        order: [['created', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment', 'userId', 'postId', 'created'],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    })
}) .then((dbPostData) => {
    const posts = dbPostData.map((post) => post.get({ plain: true }));
    res.render('dashboard', { posts, loggedIn: true, username: req.session.username});
}) .catch((err) => {
    res.status(500).json(err);
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