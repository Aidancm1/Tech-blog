const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const dashRoutes = require('./dashRoutes');

router.use('/', apiRoutes);
router.use('/', homeRoutes);
router.use('/', dashRoutes);

module.exports = router;