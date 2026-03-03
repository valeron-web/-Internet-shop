const Product = require('../models/Product');

// Получить все товары
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить товар по ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Создать товар
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Обновить товар
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удалить товар
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    await product.destroy();
    res.json({ message: 'Товар удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновить наличие товара
exports.updateStock = async (req, res) => {
  try {
    const { stock, inStock } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    await product.update({ stock, inStock });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};