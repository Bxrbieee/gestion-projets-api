// ميدلوير الأخطاء العام: يرجّع رد JSON نظيف
module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'ID invalide' });
  if (err.code === 11000) return res.status(409).json({ message: 'Ce login existe déjà' });
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
};
