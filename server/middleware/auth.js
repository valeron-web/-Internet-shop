const jwt = require('jsonwebtoken');

const JWT_SECRET = 'dtQ6ofsh8ZGTOQ3Ybbe5ugVEmo9Lpbzg';

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  console.log('Проверка токена...');
  
  if (!token) {
    console.log('Нет токена');
    return res.status(401).json({ message: 'Нет токена авторизации' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Токен валиден для:', decoded.username);
    req.admin = decoded;
    next();
  } catch (error) {
    console.log('Недействительный токен:', error.message);
    res.status(401).json({ message: 'Недействительный токен' });
  }
};