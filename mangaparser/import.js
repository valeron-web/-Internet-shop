const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Настройки подключения к БД
const dbConfig = {
  host: 'localhost',
  user: 'dropshop_user',
  password: 'Qv407Hmi1C0bI40UdY7QKorI',
  database: 'dropshipping',
  port: 3306
};

// Просто вычитаем 1 рубль
function adjustPrice(price) {
  if (!price || price <= 0) return price;
  return Number(price) - 1;
}

async function importDirectToDB() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Подключение к БД установлено');
    
    // Очищаем таблицу
    console.log('Очистка таблицы Products...');
    await connection.execute('DELETE FROM Products');
    
    // Читаем JSON
    const jsonPath = path.join(__dirname, 'output', 'products.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);
    const products = data.products || data;
    
    console.log(`Найдено товаров: ${products.length}`);
    
    let success = 0;
    
    for (const product of products) {
      const originalPrice = product.price || 0;
      const newPrice = adjustPrice(originalPrice);
      
      await connection.execute(
        `INSERT INTO Products 
         (name, description, price, category, imageUrl, stock, inStock, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          product.name,
          product.description || product.name,
          newPrice,
          product.category || 'Другое',
          product.imageUrl || '/images/default.jpg',
          product.stock || 1,
          true
        ]
      );
      
      success++;
      console.log(`${product.name.substring(0, 50)}... ${originalPrice} → ${newPrice} ₽`);
    }
    
    console.log(`\nИмпорт завершен: ${success} товаров`);
    
  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

importDirectToDB();