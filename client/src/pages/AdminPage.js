import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function AdminPage() {
  // ✅ ВСЕ ХУКИ ДОЛЖНЫ БЫТЬ ЗДЕСЬ - НА ВЕРХНЕМ УРОВНЕ
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stock: 0,
    inStock: true
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  
  const navigate = useNavigate();

  // ✅ useEffect ТОЖЕ ДОЛЖЕН БЫТЬ ЗДЕСЬ
  useEffect(() => {
    fetchProducts();
  }, []); // Пустой массив зависимостей = выполнить один раз при загрузке

  // ✅ Все остальные функции объявляются после хуков
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3307/api/products');
      setProducts(response.data);
    } catch (error) {
      showAlert('Ошибка загрузки товаров', 'danger');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: { 'x-auth-token': Cookies.get('adminToken') }
      };
      
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/admin/products/${editingProduct.id}`, formData, config);
        showAlert('Товар обновлен');
      } else {
        await axios.post('http://localhost:5000/api/admin/products', formData, config);
        showAlert('Товар добавлен');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      showAlert('Ошибка сохранения товара', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить товар?')) {
      try {
        const config = {
          headers: { 'x-auth-token': Cookies.get('adminToken') }
        };
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`, config);
        showAlert('Товар удален');
        fetchProducts();
      } catch (error) {
        showAlert('Ошибка удаления товара', 'danger');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      inStock: product.inStock
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      stock: 0,
      inStock: true
    });
  };

  const handleLogout = () => {
    Cookies.remove('adminToken');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  // ✅ Проверка на наличие токена (это НЕ хук, это условие)
  const token = Cookies.get('adminToken');
  if (!token) {
    navigate('/login');
    return null;
  }

  // ✅ JSX возвращается в самом конце
  return (
    <Container className="py-4">
      <h1 className="mb-4">Управление товарами</h1>
      
      <Button 
        variant="danger" 
        className="mb-3 float-end"
        onClick={handleLogout}
      >
        Выйти
      </Button>
      
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Button 
        variant="success" 
        className="mb-3"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        + Добавить товар
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Наличие</th>
            <th>Количество</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price} ₽</td>
              <td>
                <Button
                  variant={product.inStock ? 'success' : 'danger'}
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </Button>
              </td>
              <td>{product.stock}</td>
              <td>
                <Button 
                  variant="info" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(product)}
                >
                  ✏️
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding/editing products */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Цена</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL изображения</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Количество на складе</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="В наличии"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingProduct ? 'Сохранить' : 'Добавить'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminPage;