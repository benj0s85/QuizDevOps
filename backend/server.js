const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const quizRoutes = require('./routes/quizRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/quiz', quizRoutes);
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/frontend/src/public')));
app.use(express.static(path.join(__dirname, 'frontend', 'src', 'views')));

sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database synchronized');
    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        });
    }
}).catch(err => {
    console.error('❌ Unable to connect to the database:', err);
});

module.exports = { app };