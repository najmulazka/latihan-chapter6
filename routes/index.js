const router = require('express').Router();
const authenticate = require('./auth.routes');
const userProfile = require('./userProfile.routes');
const { restrinct } = require('../middlewares/auth.middlewares');

router.use('/authenticate', authenticate);
router.use('/userProfile', restrinct, userProfile);

module.exports = router;
