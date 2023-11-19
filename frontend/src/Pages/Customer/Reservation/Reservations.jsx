import React, { useEffect, useMemo, useState } from "react";
import {
  approveReservation,
  deleteReservation,
  formatDateTime,
  getReservations,
  rejectReservation,
} from "../../../Services/ReservationService/ReservationService";
import { getRestaurants } from "../../../Services/RestaurantServices/RestaurantServices";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { BiSolidGroup } from "react-icons/bi";

import {
  AiOutlineCheckCircle,
  AiFillCheckCircle,
  AiOutlineCloseCircle,
  AiFillCloseCircle,
} from "react-icons/ai";

import "./reservations.css";
import { useNavigate } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { theme } from "../../../theme";

const Reservations = (props) => {
  const navigate = useNavigate();

  const [reservationList, setReservationList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState([]);

  async function fetchReservations() {
    const reservations = await getReservations();
    if (reservations?.data) {
      setReservationList(reservations.data);
      const loaders = [];
      for (let i = 0; i < reservations.data.length; i++) {
        loaders.push(false);
      }
      setCardLoading([...loaders]);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
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

  const handleDelete = async (id, index) => {
    toggleCardLoader(true, index);

    const response = await deleteReservation(id);
    if (response.success) {
      fetchReservations();
    }
  };

  const reservationApproval = async (isApproved, reservation_id, index) => {
    let response = null;
    toggleCardLoader(true, index);

    if (isApproved) {
      response = await approveReservation(reservation_id);
    } else {
      response = await rejectReservation(reservation_id);
    }

    if (response.status === 200) {
      fetchReservations();
    }
  };

  const toggleCardLoader = (isLoading, index) => {
    setCardLoading((prevState) => {
      let newState = [...prevState];
      newState[index] = isLoading ?? false;
      return [...newState];
    });
  };

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
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
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
                    className="reservations-list-card"
                  >
                    {cardLoading[index] ? (
                      <Card.Body className="reservations-list-loader-card">
                        <Spinner />
                      </Card.Body>
                    ) : (
                      <>
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

                          <Card.Link
                            onClick={() => handleDelete(reservation.id, index)}
                            className="reservations-list-card-link"
                          >
                            Delete
                          </Card.Link>
                        </Card.Body>
                        <Card.Footer className="reservations-list-card-footer">
                          {reservation.isApproved === undefined ||
                          reservation.isApproved === null ? (
                            <>
                              <Card.Text
                                onClick={(e) =>
                                  reservationApproval(
                                    true,
                                    reservation.id,
                                    index
                                  )
                                }
                                className="reservations-list-card-footer-item"
                              >
                                <AiOutlineCheckCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--green" />
                                Approve
                              </Card.Text>

                              <Card.Text
                                className="reservations-list-card-footer-item"
                                onClick={(e) =>
                                  reservationApproval(
                                    false,
                                    reservation.id,
                                    index
                                  )
                                }
                              >
                                <AiOutlineCloseCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--red" />
                                Reject
                              </Card.Text>
                            </>
                          ) : (
                            <Card.Text className="reservations-list-card-footer-item">
                              {reservation.isApproved === true ? (
                                <>
                                  <AiFillCheckCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--green" />
                                  Approved
                                </>
                              ) : (
                                <>
                                  <AiFillCloseCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--red" />
                                  Rejected
                                </>
                              )}
                            </Card.Text>
                          )}
                        </Card.Footer>
                      </>
                    )}
                  </Card>
                );
              })
            : null}
        </Row>
      </Container>
    </Flex>
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
