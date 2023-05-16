import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

const NavBarView = () => {
  const navLinks = [
    //{ title: "Hobby", path: "/not_implemented" },
    { title: "Hobby List", path: "/hobby/list" },
    { title: "Route List", path: "/route/list" },
  ];

  return (
    <Navbar fixed="top" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Hinder
        </Navbar.Brand>
        <Nav className="me-auto">
          {navLinks.map((link) => (
            <Nav.Link as={Link} to={link.path} key={link.title}>
              {link.title}
            </Nav.Link>
          ))}
        </Nav>
        <Nav>
          <Nav.Link as={Link} className="text-danger" to="/">
            Sign out
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBarView;
