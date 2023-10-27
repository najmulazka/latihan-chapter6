const router = require('express').Router();
const { updateProfile } = require('../controllers/profile.controllers');
const { image } = require('../libs/multer');

router.put('/', updateProfile);
router.post('/', image.single('profile_picture'), updateProfile);

module.exports = router;
