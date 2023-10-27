const router = require('express').Router();
const { register, login, authenticate } = require('../controllers/auth.controllers');
const { restrinct } = require('../middlewares/auth.middlewares');

router.post('/register', register);
router.post('/login', login);
router.get('/', restrinct, authenticate);

module.exports = router;
