require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
// روت بسيطة باش نتأكدو السيرفر يخدم
app.get('/', (req, res) => res.json({ message: 'API Gestion de Projets OK' }));

// روت ما لقيناهوش
app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB().then(() => app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`)));
