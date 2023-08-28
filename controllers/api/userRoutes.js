const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

// create account
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create(req.body);
        req.session.save(() => {
            req.session.userId = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.status(201).json({ message: 'Created account for ${dbUserData.username}'});
        });
        } catch (err) {
            res.status(400).json(err);
        }
    });
// login account
router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            where: {username: req.body.username}
        });
        if (!dbUserData) {
            res.status(400).json({ message: 'User with ${req.params.id} is not available'});
            return;
        }
        const passwordChecker = await dbUserData.checkPassword(req.body.password)
        if (!passwordChecker) {
            res.status(400).json({ message: 'Please try again!'});
            return;
        }
        req.session.save(() => {
            req.session.userId = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.status(200).json({ message: 'Success!'});
        });
    } catch (err) {
        res.status(400).json(err);
    }
});
// logout account
router.post('/logout', withAuth, async (req, res) => {
    try {
        if (req.session.loggedIn) {
            const dbUserData = await req.session.destroy(() => {
                res.status(204).end();
            });
        } else {
            res.status(404).end();
        }
    } catch {
        res.status(400).end();
    }
});

module.exports = router;