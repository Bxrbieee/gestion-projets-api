const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ميدلوير الأول: يتأكد كان المستخدم مسجّل دخول (عندو token صحيح)
exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });
    req.user = user; // نخزنو المستخدم باش نستعملوه في الكونترولر
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// ميدلوير الثاني: يسمح برك للأدوار المطلوبة (مثلا manager)
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès refusé pour votre rôle' });
  }
  next();
};
