import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';

function Navigation() {
  const navigate = useNavigate();
  const token = Cookies.get('adminToken');
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  const handleLogout = () => {
    Cookies.remove('adminToken');
    localStorage.removeItem('admin');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">DropShop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Главная</Nav.Link>
            <Nav.Link as={Link} to="/catalog">Каталог</Nav.Link>
            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
            <Nav.Link as={Link} to="/offer">Договор оферты</Nav.Link>
            {token && (
              <Nav.Link as={Link} to="/admin">Админ панель</Nav.Link>
            )}
          </Nav>
          <Nav>
            {token ? (
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Выйти ({admin.username})
              </Button>
            ) : (
              <Nav.Link as={Link} to="/login">Вход для админа</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;