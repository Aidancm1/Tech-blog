const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');

// get posts
router.get('/', async (req, res) => {
    try {
        const dbPostData = await Post.findAll({
            attributes: ['id', 'userid', 'comment', 'postId', 'created'],
            include: [
                {
                model: Comment,
                attributes: ['id', 'userid', 'comment', 'postId', 'created'],
                include: {
                    model: User,
                    attributes: ['username']
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
        order: [['created', 'DESC']],
        })
        const posts = dbPostData.map((post) => post.get({ plain: true}));
        console.log(posts)
        res.render('homepage',
        {
            posts,
            loggedin: req.session.loggedin,
            username: req.session.username,
            userId: req.session.userId });
    } catch (err) {
        res.status(500).json(err);
    }
});
// get 1 post
router.get('/post/:id', async (req, res) => {
    try {
        const dbPostData = await Post.findOne({
            where: {id: req.params.id},
            attributes: ['id', 'userid', 'comment', 'postId', 'created'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'userid', 'comment', 'postId', 'created'],
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
        });
        if (dbPostData) {
            const post = dbPostData.get({ plain: true });
            console.log(post);
            res.render('single-post', { post, loggedIn: req.session.loggedIn, username: req.session.username, })
        } else {
            res.status(404).json({ message: "No post available for this id"});
            return;
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// login
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});
// signup
router.get('/signup', async (req, res) => {
    res.render('signup');
})

module.exports = router;