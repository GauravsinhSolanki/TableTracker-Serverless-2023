import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { getRestaurants } from "../../../Services/RestaurantServices/RestaurantServices";
import {
  bookReservations,
  editReservation,
  findRestInList,
  formatDate,
  formatDateTime,
  getReservationsById,
} from "../../../Services/ReservationService/ReservationService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./reservations.css";
import { Flex, Spinner } from "@chakra-ui/react";
import { AuthCheck } from "../Authentication/AuthCheck";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import "./reservationForm.css";
import { theme } from "../../../theme";

const ReservationForm = (props) => {
  const [restaurants, setRestaurants] = useState(null);
  const [formData, setFormData] = useState({
    restaurantId: "",
    requiredCapacity: 1,
    reservationDate: formatDate(new Date()),
    reservationTime: "",
    isApproved: null,
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isApiLoading, setApiLoading] = useState(false);
  const [isPartner, setPartner] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRestaurants();
      setRestaurants(data);

      if (location?.state?.restaurantId) {
        const restaurant = findRestInList(data, location.state.restaurantId);
        setSelectedRestaurant({ ...restaurant });
        setFormData((prevState) => {
          let newState = { ...prevState };
          newState.restaurantId = restaurant.restaurant_id ?? "";
          newState.reservationTime = restaurant.opening_time ?? "";
          return newState;
        });
      } else if (data?.length > 0) {
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

    const user = JSON.parse(sessionStorage.getItem("userDetails"));
    if (user.userType === "partner") {
      setPartner(true);
    }
  }, [location]);

  useEffect(() => {
    async function fetchReservationById(id) {
      setLoading(true);
      const reservation = await getReservationsById(id);
      if (reservation?.data) {
        const reservationDetails = { ...reservation.data };
        setSelectedRestaurant(
          findRestInList(restaurants, reservationDetails.restaurant_id)
        );
        const resTime = formatDateTime(
          reservationDetails.reservation_date
        ).split(" ")[1];
        setFormData({
          restaurantId: reservationDetails.restaurant_id,
          requiredCapacity: reservationDetails.required_capacity ?? 1,
          reservationDate: formatDate(reservationDetails.reservation_date),
          reservationTime: resTime,
          isApproved:
            reservationDetails.isApproved === undefined
              ? null
              : reservationDetails.isApproved,
        });
      }
      setLoading(false);
    }

    if (params?.reservationId) {
      fetchReservationById(params.reservationId);
    }
  }, [params]);

  const handleChange = (e, key) => {
    let value = e.target.value;

    if (key === "restaurantId") {
      setSelectedRestaurant(findRestInList(restaurants, value));
    }
    setFormData((prevState) => {
      let newState = { ...prevState };
      newState[key] = value;
      return newState;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiLoading(true);

    const request = { ...formData };
    request.reservationDate =
      request.reservationDate + " " + request.reservationTime;
    delete request.reservationTime;
    let response = null;

    if (params?.reservationId) {
      response = await editReservation({
        ...request,
        reservationId: params.reservationId,
      });
    } else {
      response = await bookReservations({ ...request });
    }

    if (response?.error) {
      setError(response?.message ?? "");
    } else if (response?.reservation_id || params?.reservationId) {
      navigate(`/restaurant/reservations`);
    } else if (response?.message) {
      setError(response.message);
    }
    setApiLoading(false);
  };

  const handleApprovalChange = (isApproved) => {
    setFormData((prevState) => {
      let newState = { ...prevState };
      newState.isApproved = isApproved;
      return { ...newState };
    });
  };

  if (isLoading) {
    return (
      <Flex
        w="100%"
        minHeight="90vh"
        backgroundColor={theme.primaryBackground}
        flexDir="column"
        alignItems="center"
        justifyContent="start"
      >
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
      </Flex>
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
      <Container
        style={{ maxWidth: "600px" }}
        className="reservation-form-container"
      >
        <Form onSubmit={handleSubmit}>
          <Row className="reservation-form-row">
            <Form.Group as={Col}>
              <Form.Label>Restaurant</Form.Label>
              <Form.Select
                onChange={(e) => handleChange(e, "restaurantId")}
                value={formData?.restaurantId ?? ""}
              >
                <option>Select restaurant</option>
                {restaurants?.length > 0 ? (
                  restaurants.map((res, index) => {
                    return (
                      <option
                        key={`res-book-${index}`}
                        value={res.restaurant_id}
                      >
                        {res.restaurant_name}
                      </option>
                    );
                  })
                ) : (
                  <option>No restaurants found</option>
                )}
              </Form.Select>
            </Form.Group>
            <div style={{ margin: "5px 0 20px" }}>
              {selectedRestaurant
                ? `Restaurant timings: ${selectedRestaurant.opening_time} - ${selectedRestaurant.closing_time}`
                : ""}
            </div>
          </Row>
          <Row className="reservation-form-row">
            <Form.Group as={Col}>
              <Form.Label>Party size</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Number of guests"
                value={formData.requiredCapacity}
                onChange={(e) => handleChange(e, "requiredCapacity")}
                min={1}
                max={(selectedRestaurant?.max_tables ?? 20) * 4}
              />
            </Form.Group>
          </Row>
          <Row className="reservation-form-row">
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
          {isPartner && params?.reservationId ? (
            <Row className="reservation-form-row">
              <Form.Group className="reservation-form-approval-group">
                <Form.Label>Approval</Form.Label>
                <Row className="reservation-form-approval">
                  <div
                    className="reservation-form-approval-col"
                    onClick={(e) => handleApprovalChange(true)}
                  >
                    {formData.isApproved === true ? (
                      <AiFillCheckCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--green" />
                    ) : (
                      <AiOutlineCheckCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--green" />
                    )}
                    {formData.isApproved === true ? "Approved" : "Approve"}
                  </div>
                  <div
                    className="reservation-form-approval-col"
                    onClick={(e) => handleApprovalChange(false)}
                  >
                    {formData.isApproved === false ? (
                      <AiFillCloseCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--red" />
                    ) : (
                      <AiOutlineCloseCircle className="reservations-list-card-footer-icon reservations-list-card-footer-icon--red" />
                    )}
                    {formData.isApproved === false ? "Rejected" : "Reject"}
                  </div>
                </Row>
              </Form.Group>
            </Row>
          ) : null}
          <Row className="reservation-form-row">
            <Form.Group
              as={Col}
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              {isApiLoading ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="lg"
                  style={{ marginTop: "20px" }}
                />
              ) : (
                <>
                  {error ? (
                    <div className="reservation-book-error">{error}</div>
                  ) : null}
                  <Button type="submit">
                    {params?.reservationId
                      ? "Edit reservation"
                      : "Book reservation"}
                  </Button>
                </>
              )}
            </Form.Group>
          </Row>
        </Form>
      </Container>
    </Flex>
  );
};
const ReservationFormPage = AuthCheck(ReservationForm);
export default ReservationFormPage;
