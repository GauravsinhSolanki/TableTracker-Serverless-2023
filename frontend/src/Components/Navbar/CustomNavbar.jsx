import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";

function CustomNavbar(props) {
  const user = JSON.parse(sessionStorage.getItem("userDetails"));
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPartner, setPartner] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isCustomer, setCustomer] = useState(false);

  useEffect(() => {
    if (user) {
      setLoggedIn(true);
      const userDetails = user;
      if (userDetails?.userType === "partner") {
        setPartner(true);
      }
      if (userDetails?.userType === "admin") {
        setAdmin(true);
      }
      if (userDetails?.userType === "user") {
        setCustomer(true);
      }
    } else {
      setLoggedIn(false);
      setPartner(false);
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
              <Nav.Link href="/partner/login">Partner Login</Nav.Link>
              <Nav.Link href="/partner/signup">Partner Signup</Nav.Link>
              <Nav.Link href="/user/login">Customer Login</Nav.Link>
              <Nav.Link href="/user/signup">Customer Signup</Nav.Link>
            </>
          ) : (
            <>
              {isPartner ? (
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              ) : null}
              {isPartner ? (
                <Nav.Link href={`/restaurant/${user?.restaurant_id ?? ""}`}>
                  Restaurant
                </Nav.Link>
              ) : null}
              {isCustomer ? (
                <Nav.Link href="/restaurantList">Restaurants</Nav.Link>
              ) : null}
              {isCustomer ? (
                <Nav.Link href="/restaurant/reservations">
                  Reservations
                </Nav.Link>
              ) : null}

              {isAdmin ? (
                <Nav.Link href="/admin/restaurant-reviews">Reviews</Nav.Link>
              ) : null}

              {isAdmin ? (
                <Nav.Link href="/admin/restaurant-most-orders">Most Orders</Nav.Link>
              ) : null}

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
