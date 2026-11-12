const router = require('express').Router();
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
// route محمية: لازم token
router.get('/me', protect, me);

module.exports = router;
