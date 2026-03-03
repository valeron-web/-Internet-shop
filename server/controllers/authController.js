const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'dtQ6ofsh8ZGTOQ3Ybbe5ugVEmo9Lpbzg';

// Регистрация первого админа
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const adminCount = await Admin.count();
    
    if (adminCount > 0) {
      return res.status(403).json({ message: 'Регистрация закрыта' });
    }
    
    const admin = await Admin.create({ username, password });
    res.status(201).json({ message: 'Администратор создан' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Вход в систему
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ where: { username } });
    
    if (!admin) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }
    
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Проверка токена
exports.verifyToken = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!admin) {
      return res.status(404).json({ message: 'Администратор не найден' });
    }
    
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register: exports.register,
  login: exports.login,
  verifyToken: exports.verifyToken
};