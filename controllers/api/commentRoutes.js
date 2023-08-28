const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
// get all comments
router.get('/', async (req, res) => {
    try{
        const dbCommentData = await Comment.findAll({});
        if (dbCommentData.length === 0) {
            res.status(404).json({message: "No comments available"});
            return;
        };
        res.status(200).json(dbCommentData);
    } catch (err) {
        res.status(500).json(err);
    }
});
// get comments for 1 post
router.get('/:id', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: { id: req.params.id },
        });
        if (commentData.length === 0) {
            res.status(404).json({ message: '${req.params.id} has no avaialble comment.'});
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});
// create a comment
router.post('/', withAuth, async (req, res) => {
    const body = req.body;
    try {
        const newComment = await Comment.create({
            ...body,
            userId: req.session.userId,
        });
        res.status(200).json({ newComment, success: true });
    } catch (err) {
        res.status(500).json(err);
    }
});
// delete comment
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const dbCommentData = await Comment.destroy({
            where: {id: req.params.id},
        });
        if (!dbCommentData) {
            res.status(404).json({
                message: 'No comment available with id = ${req.params.id}',
            });
            return;
        }
        res.status(200).json({dbCommentData, success: true});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;