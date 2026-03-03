import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4">Добро пожаловать в DropShop</h1>
              <p className="lead">
                Лучшие товары по лучшим ценам. Быстрая доставка по всей России.
              </p>
              <Button as={Link} to="/catalog" variant="light" size="lg">
                Перейти в каталог
              </Button>
            </Col>
            <Col md={6}>
              <img 
                src="https://via.placeholder.com/600x400" 
                alt="Hero" 
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Почему выбирают нас</h2>
        <Row>
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <Card.Title>🚚 Быстрая доставка</Card.Title>
                <Card.Text>
                  Доставляем по всей России за 3-5 дней
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <Card.Title>💰 Низкие цены</Card.Title>
                <Card.Text>
                  Прямые поставки от производителей
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <Card.Title>✅ Гарантия качества</Card.Title>
                <Card.Text>
                  Все товары сертифицированы
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;