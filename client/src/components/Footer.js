import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>DropShop</h5>
            <p>Ваш надежный партнер в мире дропшиппинга</p>
          </Col>
          <Col md={4}>
            <h5>Навигация</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Главная</Link></li>
              <li><Link to="/catalog" className="text-white text-decoration-none">Каталог</Link></li>
              <li><Link to="/faq" className="text-white text-decoration-none">FAQ</Link></li>
              <li><Link to="/offer" className="text-white text-decoration-none">Договор оферты</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Контакты</h5>
            <p>Email: info@dropshop.ru<br/>
            Телефон: 8 (800) 555-35-35</p>
          </Col>
        </Row>
        <hr />
        <p className="text-center mb-0">
          © 2026 DropShop. Все права защищены.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;