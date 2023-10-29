import React, { useEffect, useMemo, useState } from "react";
import {
  formatDateTime,
  getReservations,
} from "../../../Services/ReservationService/ReservationService";
import { getRestaurants } from "../../../Services/RestaurantServices/RestaurantServices";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { BiSolidGroup } from "react-icons/bi";
import "./reservations.css";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

const Reservations = (props) => {
  const navigate = useNavigate();

  const [reservationList, setReservationList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      const reservations = await getReservations();
      if (reservations?.data) {
        setReservationList(reservations.data);
      }
      setLoading(false);
    }

    fetchReservations();
  }, []);

  useEffect(() => {
    async function fetchRestaurants() {
      const restaurants = await getRestaurants();
      if (restaurants?.length) {
        setRestaurants(restaurants);
      }
    }

    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Row style={{ justifyContent: "center", marginTop: "100px" }}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Row>
      </Container>
    );
  }

  return (
    <Container className="reservations-list">
      <Row className="reservations-list-row">
        <div className="reservations-list-title">Reservations</div>
        <Button
          className="reservations-list-button"
          onClick={() => navigate("/restaurant/book")}
        >
          Book Reservation
        </Button>
      </Row>
      <Row className="reservations-list-row">
        {reservationList?.length
          ? reservationList.map((reservation, index) => {
              const restaurant = getRestaurant(
                reservation.restaurant_id,
                restaurants
              );
              const reservationDateTime = formatDateTime(
                reservation.reservation_date
              );

              return (
                <Card
                  key={`res-card-${index}`}
                  style={{ width: "18rem" }}
                  className="reservations-list-card"
                >
                  <Card.Body>
                    <Card.Title className="reservations-list-card-name">
                      {restaurant?.restaurant_name ?? ""}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted reservations-list-card-date">
                      {reservationDateTime}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted reservations-list-card-party">
                      <BiSolidGroup className="reservations-list-card-icon" />
                      {reservation.required_capacity}
                    </Card.Subtitle>
                    <Card.Link
                      onClick={() =>
                        navigate(`/restaurant/book/${reservation.id}`)
                      }
                      className="reservations-list-card-link"
                    >
                      Edit
                    </Card.Link>
                    <Card.Link
                      onClick={() =>
                        navigate(
                          `/customer/menu/${reservation.restaurant_id}/${reservation.id}`
                        )
                      }
                      className="reservations-list-card-link"
                    >
                      Book menu
                    </Card.Link>
                  </Card.Body>
                </Card>
              );
            })
          : null}
      </Row>
    </Container>
  );
};

const getRestaurant = (id, restaurantList) => {
  if (!restaurantList || !id) {
    return null;
  }
  const restaurant = restaurantList.filter((item) => id == item.restaurant_id);
  if (restaurant) {
    return restaurant[0];
  }

  return null;
};

export default Reservations;
