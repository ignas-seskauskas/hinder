import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { SessionStorageKey } from "../../constants/sessionStorage";

const NavBarView = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem(SessionStorageKey.Login);
    navigate("/");
  };

  const navLinks = [
    //{ title: "Hobby", path: "/not_implemented" },
    { title: "Hobby List", path: "/hobby/list" },
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
          <Nav.Link className="text-danger" onClick={logout}>
            Sign out
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBarView;
