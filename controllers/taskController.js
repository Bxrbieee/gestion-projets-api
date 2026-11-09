const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { canAccess, buildSort } = require('./projectController');

// POST /api/projects/:projectId/tasks — أي مستخدم مسجّل يعمل تاسك
exports.createTask = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    const { titre, description, statut, deadline } = req.body;
    // ملاحظة: ما ناخذوش utilisateurAssigne من الـ body — الـ manager برك يعيّن (route /assign)
    const task = await Task.create({ titre, description, statut, deadline, projet: project._id });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

// GET /api/projects/:projectId/tasks?search=&statut=&sort=
exports.getTasks = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (!canAccess(project, req.user)) return res.status(403).json({ message: 'Accès refusé' });
    const { search, statut, sort } = req.query;
    const filter = { projet: project._id };
    if (statut) filter.statut = statut;
    if (search) filter.titre = { $regex: search, $options: 'i' }; // بحث بالعنوان
    const tasks = await Task.find(filter)
      .sort(buildSort(sort, ['titre', 'statut', 'deadline', 'dateCreation'], '-dateCreation'))
      .populate('utilisateurAssigne', 'nom login');
    res.json(tasks);
  } catch (err) { next(err); }
};

// نجيبو التاسك ونتأكدو من الصلاحية عن طريق المشروع متاعو
const loadTaskWithAccess = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404).json({ message: 'Tâche introuvable' }); return null; }
  const project = await Project.findById(task.projet);
  if (!project || !canAccess(project, req.user)) {
    res.status(403).json({ message: 'Accès refusé' }); return null;
  }
  return task;
};

// GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await loadTaskWithAccess(req, res);
    if (task) res.json(task);
  } catch (err) { next(err); }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await loadTaskWithAccess(req, res);
    if (!task) return;
    ['titre', 'description', 'statut', 'deadline'].forEach(f => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });
    await task.save(); // الـ enum يرفض أي statut غالط
    res.json(task);
  } catch (err) { next(err); }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await loadTaskWithAccess(req, res);
    if (!task) return;
    await task.deleteOne();
    res.json({ message: 'Tâche supprimée' });
  } catch (err) { next(err); }
};

// PATCH /api/tasks/:id/assign — المانجر برك (restrictTo في الروت)
exports.assignTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tâche introuvable' });
    const user = await User.findById(req.body.utilisateurId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    task.utilisateurAssigne = user._id;
    await task.save();
    res.json(task);
  } catch (err) { next(err); }
};
