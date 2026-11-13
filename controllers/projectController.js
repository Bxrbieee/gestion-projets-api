const Project = require('../models/Project');
const Task = require('../models/Task');

// دالة صغيرة تبني الترتيب: ?sort=-dateCreation  (الناقص = تنازلي)
// نستعملو whitelist باش المستخدم ما يرتبش بحقل ما نحبوش
const buildSort = (sort, allowed, fallback) => {
  if (!sort) return fallback;
  const field = sort.startsWith('-') ? sort.slice(1) : sort;
  return allowed.includes(field) ? sort : fallback;
};

// نتأكدو كان المستخدم عندو الحق في المشروع (صاحبو ولا manager)
const canAccess = (project, user) =>
  user.role === 'manager' || String(project.proprietaire) === String(user._id);

exports.canAccess = canAccess;
exports.buildSort = buildSort;

// POST /api/projects — أي مستخدم مسجّل يعمل مشروع
exports.createProject = async (req, res, next) => {
  try {
    const { nom, description, statut } = req.body;
    const project = await Project.create({ nom, description, statut, proprietaire: req.user._id });
    res.status(201).json(project);
  } catch (err) { next(err); }
};

// GET /api/projects — المستخدم يشوف مشاريعو برك، المانجر يشوف الكل
exports.getProjects = async (req, res, next) => {
  try {
    const { search, statut, sort } = req.query;
    const filter = {};
    if (req.user.role !== 'manager') filter.proprietaire = req.user._id;
    if (statut) filter.statut = statut;
    if (search) filter.nom = { $regex: search, $options: 'i' }; // بحث بالاسم
    const projects = await Project.find(filter)
      .sort(buildSort(sort, ['nom', 'statut', 'dateCreation'], '-dateCreation'))
      .populate('proprietaire', 'nom login');
    res.json(projects);
  } catch (err) { next(err); }
};

// GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('proprietaire', 'nom login');
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (!canAccess(project, req.user)) return res.status(403).json({ message: 'Accès refusé' });
    res.json(project);
  } catch (err) { next(err); }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (!canAccess(project, req.user)) return res.status(403).json({ message: 'Accès refusé' });
    // نبدلو برك الحقول المسموحة (مش المالك)
    ['nom', 'description', 'statut'].forEach(f => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });
    await project.save();
    res.json(project);
  } catch (err) { next(err); }
};

// DELETE /api/projects/:id — نفسخو المشروع وكل التاسكات متاعو
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (!canAccess(project, req.user)) return res.status(403).json({ message: 'Accès refusé' });
    await Task.deleteMany({ projet: project._id });
    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
  } catch (err) { next(err); }
};

// GET /api/projects/:id/stats — عدد التاسكات حسب الحالة
exports.getProjectStats = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (!canAccess(project, req.user)) return res.status(403).json({ message: 'Accès refusé' });

    // نعدّو التاسكات لكل حالة
    const todo = await Task.countDocuments({ projet: project._id, statut: 'todo' });
    const doing = await Task.countDocuments({ projet: project._id, statut: 'doing' });
    const done = await Task.countDocuments({ projet: project._id, statut: 'done' });

    res.json({ projet: project.nom, todo, doing, done, total: todo + doing + done });
  } catch (err) { next(err); }
};
