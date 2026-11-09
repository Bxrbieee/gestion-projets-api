const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: [true, 'Le titre est requis'], trim: true },
  description: { type: String, default: '' },
  // الحالة لازم تكون وحدة من الثلاثة هاذم برك
  statut: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  deadline: { type: Date },
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  utilisateurAssigne: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
