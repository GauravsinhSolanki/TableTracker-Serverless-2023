import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";

function CustomNavbar(props) {
  const user = JSON.parse(sessionStorage.getItem("userDetails"));
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setLoggedIn(true);
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
              <Nav.Link href="/admin/login">Admin Login</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/admin/restaurant-most-orders">
                Most Orders
              </Nav.Link>

              <Nav.Link href="/admin/topcustomers">Top Customers </Nav.Link>

              <Nav.Link href="/admin/restaurant-reviews">Reviews</Nav.Link>

              <Nav.Link href="/admin/food-most-ordered-time">
                Periodic Food Orders
              </Nav.Link>

              <Nav.Link href="/admin/top10-orders">Top 10 Orders</Nav.Link>

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
