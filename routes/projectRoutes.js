const router = require('express').Router();
const { protect } = require('../middlewares/auth');
const p = require('../controllers/projectController');
const t = require('../controllers/taskController');

// كل الروتات هنا محمية بـ protect
router.use(protect);

router.route('/').post(p.createProject).get(p.getProjects);
router.route('/:id').get(p.getProject).put(p.updateProject).delete(p.deleteProject);
router.get('/:id/stats', p.getProjectStats);
// التاسكات المرتبطة بالمشروع
router.route('/:projectId/tasks').post(t.createTask).get(t.getTasks);

module.exports = router;
