import {
  Button,
  CircularProgress,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRestaurantReview,
  getFirestoreRestaurant,
  getRestaurantsByID,
  updateRestaurant,
} from "../../../Services/RestaurantServices/RestaurantServices";
import { theme } from "../../../theme";
import { AuthCheck } from "../Authentication/AuthCheck";
import { getReservationsByRestaurant } from "../../../Services/ReservationService/ReservationService";
import { Rating } from "react-simple-star-rating";
import "./restaurant.css";
import { Card, Container, Row, Form } from "react-bootstrap";
import EditRestaurantModal from "./EditRestaurantModal";

function Restaurant() {
  const user = JSON.parse(sessionStorage.getItem("userDetails"));
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });
  const [restaurant, setRestaurant] = useState(null);
  const [firestoreRestaurant, setFirestoreRestaurant] = useState(null);
  const [isPartner, setPartner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [isCreateReviewLoading, setIsCreateReviewLoading] = useState(false);

  const { restaurant_id } = useParams();
  const navigate = useNavigate();

  const fetchFirestoreRestaurant = async (data = null) => {
    const response = await getFirestoreRestaurant(restaurant_id);
    if (response === null && data !== null) {
      updateRestaurant({
        restaurant_id: restaurant_id,
        restaurant_name: data?.restaurant_name ?? "",
        opening_time: data?.opening_time ?? "",
        closing_time: data?.closing_time ?? "",
        max_tables: data?.max_tables ?? 0,
      });
    } else {
      setFirestoreRestaurant(response?.data);
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("userDetails"));
    if (user.userType == "partner") {
      setPartner(true);
    }
    const fetchData = async () => {
      const data = await getRestaurantsByID(restaurant_id);
      setRestaurant(data);
      fetchFirestoreRestaurant(data);
    };
    fetchData();
  }, []);

  const handleEditClose = async (refreshData) => {
    await fetchFirestoreRestaurant();
    setShowEditModal(false);
  };

  const handleReviewChange = (e, key) => {
    setNewReview((prevState) => {
      let newState = { ...prevState };
      if (key === "rating") {
        newState[key] = e;
      } else {
        newState[key] = e.target.value;
      }
      return { ...newState };
    });
  };

  const handleSubmitReview = async () => {
    setIsCreateReviewLoading(true);
    const response = await createRestaurantReview(restaurant.restaurant_id, {
      ...newReview,
      user_id: user.uid,
    });
    if (response.data) {
      setNewReview({ rating: 0, comment: "" });
      fetchFirestoreRestaurant();
    }
    setIsCreateReviewLoading(false);
  };

  return isMobile ? (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      <Text color="white">Restaurant List</Text>
    </Flex>
  ) : restaurant ? (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      <EditRestaurantModal
        show={showEditModal}
        handleClose={handleEditClose}
        restaurant={firestoreRestaurant}
      />
      <Container className="restaurant-container">
        <Card className="restaurant-card">
          <Flex
            w="100%"
            flexDirection="row"
            alignItems="start"
            justifyContent={"space-around"}
          >
            <Flex w="50%" flexDirection="column" gap="10px" alignItems="center">
              <Text fontSize="2xl" fontWeight="semibold">
                {restaurant.restaurant_name}
              </Text>
              <Text>Phone No: {restaurant.phone_no}</Text>
              <Text>Address: {restaurant.address}</Text>
              {isPartner ? null : (
                <Button
                  borderColor={theme.secondaryForeground}
                  bgColor={theme.accent}
                  onClick={() =>
                    navigate("/restaurant/book", {
                      state: { restaurantId: restaurant_id },
                    })
                  }
                >
                  Book
                </Button>
              )}
            </Flex>
            <Flex
              w="50%"
              flexDirection="column"
              gap="10px"
              alignItems="start"
              pl="30px"
              className="restaurant-card-divider"
            >
              <Flex direction="row" gap={5}>
                <Button
                  borderColor={theme.secondaryForeground}
                  bgColor={theme.accent}
                  onClick={() =>
                    navigate(`/partner/menu/${restaurant_id}`, {
                      state: { restaurantId: restaurant_id },
                    })
                  }
                >
                  View Menu
                </Button>
                {isPartner ? (
                  <Button
                    borderColor={theme.secondaryForeground}
                    bgColor={theme.accent}
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit restaurant details
                  </Button>
                ) : null}
              </Flex>
              <Rating
                size={35}
                allowFraction={true}
                className="restaurant-rating"
                initialValue={firestoreRestaurant?.rating ?? 0}
                readonly
              />
              <Text>Max tables: {firestoreRestaurant?.max_tables ?? 0}</Text>
              <Text>
                Opening Time: {firestoreRestaurant?.opening_time ?? ""}
              </Text>
              <Text>
                Closing Time: {firestoreRestaurant?.closing_time ?? ""}
              </Text>
              <Text style={{ fontWeight: 600 }}>Reviews</Text>

              <div className="restaurant-reviews">
                {firestoreRestaurant?.reviews
                  ? firestoreRestaurant.reviews.map((review, index) => {
                      return (
                        <Card
                          className="restaurant-review-card"
                          key={`review-${index}`}
                        >
                          <Rating
                            size={30}
                            allowFraction={true}
                            className="restaurant-rating"
                            initialValue={review?.rating ?? 0}
                            readonly
                          />
                          <Text>{review?.comment ?? ""}</Text>
                        </Card>
                      );
                    })
                  : null}
              </div>
              {isPartner ? null : (
                <div className="restaurant-create-review">
                  <Rating
                    size={30}
                    allowFraction={true}
                    className="restaurant-rating"
                    initialValue={newReview.rating}
                    onClick={(e) => handleReviewChange(e, "rating")}
                  />
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter comment"
                    value={newReview.comment}
                    onChange={(e) => handleReviewChange(e, "comment")}
                    className="restaurant-create-review-textarea"
                  />
                  {isCreateReviewLoading ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="lg"
                    />
                  ) : (
                    <Button
                      className="review-submit"
                      onClick={handleSubmitReview}
                    >
                      Add review
                    </Button>
                  )}
                </div>
              )}
            </Flex>
          </Flex>
        </Card>
      </Container>
    </Flex>
  ) : (
    <Flex
      w="100%"
      backgroundColor={theme.primaryBackground}
      minHeight="90vh"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress isIndeterminate color="teal" />
    </Flex>
  );
}

const RestaurantPage = AuthCheck(Restaurant);
export default RestaurantPage;
