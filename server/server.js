const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth'); // Добавляем

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes); // Добавляем

// Синхронизация с базой данных
sequelize.sync({ alter: true })
  .then(() => {
    console.log('База данных синхронизирована');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Ошибка синхронизации БД:', err);
  });