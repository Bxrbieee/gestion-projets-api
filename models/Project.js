const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom du projet est requis'], trim: true },
  description: { type: String, default: '' },
  // صاحب المشروع (ID متاع المستخدم)
  proprietaire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  statut: { type: String, enum: ['en cours', 'terminé', 'en pause'], default: 'en cours' },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
