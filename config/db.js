const mongoose = require('mongoose');

// نعملو الاتصال بقاعدة البيانات MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');
  } catch (err) {
    // كان صار مشكل في الاتصال نوقفو السيرفر
    console.error('Erreur MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
