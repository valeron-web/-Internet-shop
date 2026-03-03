const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin'
  }
}, {
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      }
    }
  }
});

// Метод для проверки пароля
Admin.prototype.comparePassword = async function(candidatePassword) {
  console.log('\n Вызван comparePassword:');
  console.log('   - candidatePassword:', candidatePassword);
  console.log('   - this.password (из БД):', this.password);
  
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('   - Результат bcrypt.compare:', result);
    return result;
  } catch (error) {
    console.error('   - Ошибка в comparePassword:', error);
    return false;
  }
};

module.exports = Admin;