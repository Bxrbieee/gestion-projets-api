const router = require('express').Router();
const { protect, restrictTo } = require('../middlewares/auth');
const t = require('../controllers/taskController');

router.use(protect);

router.route('/:id').get(t.getTask).put(t.updateTask).delete(t.deleteTask);
// التعيين للمانجر برك
router.patch('/:id/assign', restrictTo('manager'), t.assignTask);

module.exports = router;
