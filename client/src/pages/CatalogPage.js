import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояния для сортировки
  const [sortBy, setSortBy] = useState('default'); // default, price-asc, price-desc, name
  
  // Состояния для модального окна заказа
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({
    phone: '',
    contact: '', // telegram или whatsapp
    contactType: 'telegram' // telegram или whatsapp
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [selectedCategory, searchTerm, products, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3307/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      
      const uniqueCategories = [...new Set(response.data.map(p => p.category))];
      setCategories(uniqueCategories);
      setError(null);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Сортировка
    switch(sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // По умолчанию - без сортировки (как пришло с сервера)
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
    setOrderSubmitted(false);
    setOrderForm({ phone: '', contact: '', contactType: 'telegram' });
  };

  const handleOrderSubmit = async () => {
    // Здесь можно отправить заказ на сервер или в Telegram бота
    console.log('Заказ:', {
      product: selectedProduct,
      ...orderForm
    });
    
    // Пока просто показываем подтверждение
    setOrderSubmitted(true);
    
    // Через 3 секунды закрываем окно
    setTimeout(() => {
      setShowOrderModal(false);
      setOrderSubmitted(false);
    }, 3000);
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-3">Загрузка товаров...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-danger">❌ {error}</h3>
        <Button variant="primary" onClick={fetchProducts} className="mt-3">
          Повторить попытку
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Каталог товаров</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-5">
          <h3>😕 Товаров пока нет</h3>
          <p className="text-muted">Скоро здесь появятся интересные предложения</p>
        </div>
      ) : (
        <>
          {/* Фильтры и сортировка */}
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Поиск</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Категория</Form.Label>
                <Form.Select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Все категории</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Сортировка</Form.Label>
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Цена: от низкой к высокой</option>
                  <option value="price-desc">Цена: от высокой к низкой</option>
                  <option value="name">По названию</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <p className="mb-0 text-muted">
                Найдено: {filteredProducts.length} товаров
              </p>
            </Col>
          </Row>

          {/* Сетка товаров */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h4>😕 Товары не найдены</h4>
              <p>Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <Row>
              {filteredProducts.map(product => (
                <Col key={product.id} md={4} lg={3} className="mb-4">
                  <Card className="h-100 d-flex flex-column">
                    {/* Изображение с object-fit contain */}
                    <div style={{ 
                      height: '200px', 
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px'
                    }}>
                      <Card.Img 
                        src={product.imageUrl ? `http://localhost:3000${product.imageUrl}` : 'https://via.placeholder.com/300x200?text=No+Image'} 
                        style={{ 
                          maxHeight: '100%',
                          maxWidth: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    </div>
                    
                    {/* Тело карточки занимает всё доступное пространство */}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="mb-2">{product.name}</Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        {product.description?.substring(0, 120)}...
                      </Card.Text>
                      
                      {/* Цена и кнопка будут внизу благодаря flex-grow и mt-auto */}
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="h5 mb-0">{product.price.toLocaleString()} ₽</span>
                        </div>
                        
                        <Button 
                          variant="primary" 
                          className="w-100"
                          onClick={() => handleOrderClick(product)}
                        >
                          Купить
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Модальное окно заказа */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Оформление заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderSubmitted ? (
            <div className="text-center py-4">
              <h4 className="text-success mb-3">✅ Заявка отправлена!</h4>
              <p>Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <>
              {selectedProduct && (
                <div className="mb-4 p-3 bg-light rounded">
                  <h6>Товар:</h6>
                  <p className="mb-1"><strong>{selectedProduct.name}</strong></p>
                  <p className="mb-0">Цена: {selectedProduct.price.toLocaleString()} ₽</p>
                </div>
              )}
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Номер телефона <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleOrderFormChange}
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                  <Form.Text className="text-muted">
                    Для связи и подтверждения заказа
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Предпочитаемый способ связи</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Telegram"
                      name="contactType"
                      value="telegram"
                      checked={orderForm.contactType === 'telegram'}
                      onChange={handleOrderFormChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="WhatsApp"
                      name="contactType"
                      value="whatsapp"
                      checked={orderForm.contactType === 'whatsapp'}
                      onChange={handleOrderFormChange}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    {orderForm.contactType === 'telegram' ? 'Telegram ID' : 'WhatsApp номер'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={orderForm.contact}
                    onChange={handleOrderFormChange}
                    placeholder={orderForm.contactType === 'telegram' ? '@username' : '+7 (999) 123-45-67'}
                  />
                  <Form.Text className="text-muted">
                    Необязательно, если номер телефона совпадает
                  </Form.Text>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!orderSubmitted && (
            <>
              <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                Отмена
              </Button>
              <Button 
                variant="primary" 
                onClick={handleOrderSubmit}
                disabled={!orderForm.phone}
              >
                Отправить заявку
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CatalogPage;