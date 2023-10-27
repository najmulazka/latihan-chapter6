const router = require('express').Router();
const { updateProfile } = require('../controllers/profile.controllers');
const { image } = require('../libs/multer');

router.put('/', image.single('profile_picture'), updateProfile);

module.exports = router;
