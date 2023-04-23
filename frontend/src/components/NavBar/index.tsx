import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const MenuBarView = () => {
  return (
    <Navbar fixed="top" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/home">Hinder</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/hobby">Hobby</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MenuBarView;
