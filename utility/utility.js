// utility/utility.js

const utility = {
    // Функция для хеширования паролей (если используется)
    hashPassword: async (password) => {
        // Здесь может быть ваша логика хеширования
        return password; // временно возвращаем как есть
    },

    // Функция для генерации случайных строк
    generateRandomString: (length = 10) => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    },

    // Функция для валидации email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Другие полезные функции
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('ru-RU');
    }
};

module.exports = utility;