import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { NavLink, useNavigate } from "react-router-dom";
import { theme } from "../../theme";
import { Container, Nav, Navbar } from "react-bootstrap";

function CustomNavbar(props) {
  const user = sessionStorage.getItem("userDetails");
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);

  function logoutUser() {
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <Navbar className="bg-body-tertiary sdp3-navbar">
      <Container>
        <Navbar.Brand href="/dashboard">
          <img
            alt=""
            src="/src/assets/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          TableTracker
        </Navbar.Brand>
        <Nav className="me-auto sdp3-navbar-links">
          {!isLoggedIn ? (
            <>
              <Nav.Link href="/user/login">Login</Nav.Link>
              <Nav.Link href="/user/signup">Signup</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/restaurantList">Restaurants</Nav.Link>
              <Nav.Link href="/restaurant/reservations">Reservations</Nav.Link>

              <Nav.Link
                href=""
                onClick={logoutUser}
                className="sdp3-navbar-logout"
              >
                Logout
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
