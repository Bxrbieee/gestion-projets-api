const jwt = require('jsonwebtoken');
const User = require('../models/User');

// نصنعو الـ token فيه الـ id متاع المستخدم
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

// POST /api/auth/register — تسجيل مستخدم جديد
exports.register = async (req, res, next) => {
  try {
    const { nom, login, motDePasse, role } = req.body;
    const user = await User.create({ nom, login, motDePasse, role });
    res.status(201).json({
      token: signToken(user._id),
      user: { id: user._id, nom: user.nom, login: user.login, role: user.role }
    });
  } catch (err) { next(err); }
};

// POST /api/auth/login — تسجيل الدخول
exports.login = async (req, res, next) => {
  try {
    const { login, motDePasse } = req.body;
    if (!login || !motDePasse) return res.status(400).json({ message: 'Login et mot de passe requis' });
    // select('+motDePasse') خاطر في الـ schema مخبّي بالافتراضي
    const user = await User.findOne({ login }).select('+motDePasse');
    if (!user || !(await user.comparePassword(motDePasse))) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    res.json({
      token: signToken(user._id),
      user: { id: user._id, nom: user.nom, login: user.login, role: user.role }
    });
  } catch (err) { next(err); }


};
  
// GET /api/auth/me نرجّعو معلومات المستخدم المسجّل دخولو
exports.me = (req, res) => {
  res.json({
    id: req.user._id,
    nom: req.user.nom,
    login: req.user.login,
    role: req.user.role
  });
};
