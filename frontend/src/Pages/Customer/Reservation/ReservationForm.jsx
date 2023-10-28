import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { getRestaurants } from "../../../Services/RestaurantServices/RestaurantServices";
import {
  bookReservations,
  findRestInList,
  formatDate,
} from "../../../Services/ReservationService/ReservationService";
import { useNavigate } from "react-router-dom";

const ReservationForm = (props) => {
  const [restaurants, setRestaurants] = useState(null);
  const [formData, setFormData] = useState({
    restaurantId: "",
    requiredCapacity: 1,
    reservationDate: formatDate(new Date()),
    reservationTime: "",
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRestaurants();
      setRestaurants(data);

      if (data?.length > 0) {
        setSelectedRestaurant({ ...data[0] });
        setFormData((prevState) => {
          let newState = { ...prevState };
          newState.restaurantId = data[0].restaurant_id ?? "";
          newState.reservationTime = data[0].opening_time ?? "";
          return newState;
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e, key) => {
    let value = e.target.value;

    if (key === "restaurantId") {
      setSelectedRestaurant(findRestInList(restaurants, value));
    }
    console.log(value);
    setFormData((prevState) => {
      let newState = { ...prevState };
      newState[key] = value;
      return newState;
    });
  };

  useEffect(() => {
    console.log(selectedRestaurant);
  }, [selectedRestaurant]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    const request = { ...formData };
    request.reservationDate =
      request.reservationDate + " " + request.reservationTime;
    delete request.reservationTime;
    const response = await bookReservations({ ...request });
    if (response?.reservation_id) {
      navigate(`/restaurantList/${request.restaurantId}`);
    }
  };

  return (
    <Container style={{ maxWidth: "600px" }}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Restaurant</Form.Label>
            <Form.Select onChange={(e) => handleChange(e, "restaurantId")}>
              <option>Select restaurant</option>
              {restaurants?.length > 0 ? (
                restaurants.map((res, index) => {
                  return (
                    <option key={`res-book-${index}`} value={res.restaurant_id}>
                      {res.restaurant_name}
                    </option>
                  );
                })
              ) : (
                <option>No restaurants found</option>
              )}
            </Form.Select>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Party size</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Number of guests"
              value={formData.requiredCapacity}
              onChange={(e) => handleChange(e, "requiredCapacity")}
              min={1}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Reservation date</Form.Label>
            <Form.Control
              required
              type="date"
              placeholder="Date of reservation"
              value={formData.reservationDate}
              onChange={(e) => handleChange(e, "reservationDate")}
              min={formatDate(new Date())}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Reservation time</Form.Label>
            <Form.Control
              required
              type="time"
              placeholder="Time of reservation"
              value={formData.reservationTime}
              onChange={(e) => handleChange(e, "reservationTime")}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group
            as={Col}
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <Button type="submit"> Book reservation</Button>
          </Form.Group>
        </Row>
      </Form>
    </Container>
  );
};

export default ReservationForm;
