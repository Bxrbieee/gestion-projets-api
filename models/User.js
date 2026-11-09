const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  login: { type: String, required: true, unique: true, trim: true },
  motDePasse: { type: String, required: true, minlength: 6, select: false },
  // الدور: يا user يا manager برك
  role: { type: String, enum: ['user', 'manager'], default: 'user' },
  dateCreation: { type: Date, default: Date.now }
});

// قبل ما نسجلو المستخدم نكريبتيو الموت دي باس
userSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

// نقارنو الموت دي باس اللي كتبو المستخدم بالكريبتي
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);
