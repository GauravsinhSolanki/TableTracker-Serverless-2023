import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  CircularProgress,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { getRestaurants } from "../../../Services/RestaurantServices/RestaurantServices";
import { theme } from "../../../theme";
import { AuthCheck } from "../Authentication/AuthCheck";
import { Button } from "react-bootstrap";
import config from "../../../../config.json";
import axios from "axios";
import { getHolisticData } from "../../../Services/ReservationService/ReservationService";

function RestaurantList() {
  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });
  const [restaurants, setRestaurants] = useState(null);
  const navigate = useNavigate();
  const [restaurantDiscount, setRestaurantDiscount] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRestaurants();

      const promises = data.map(async (restaurant) => {
        const url = `${config.Menu.getApiUrl}/${restaurant.restaurant_id}`;
        try {
          const response = await axios.get(url);
          return {
            id: restaurant.restaurant_id,
            discount: response.data.discount,
          };
        } catch (err) {
          console.log(
            `Unable to fetch data for menu of restaurant ${restaurant.restaurant_id}`
          );
          return { id: restaurant.restaurant_id, discount: null };
        }
      });

      const discounts = await Promise.all(promises);
      console.log(discounts);
      setRestaurantDiscount(discounts);
      setRestaurants(data);
    };
    fetchData();
  }, []);

  const getDiscountById = (restaurant) => {
    const foundDiscount = restaurantDiscount.find(
      (rest) => rest.id === restaurant.restaurant_id
    );
    return foundDiscount.discount > 0 ? 
    (
      <Flex flexDirection="row">
        <Box w="42%" />
        {restaurant.restaurant_name}
        <Spacer />
        <Box bgColor="#7cf1c4" borderRadius="2px" padding="5px">
          {foundDiscount.discount} % Off
        </Box>
      </Flex>
    ) : (
      <span>{restaurant.restaurant_name}</span>
    );
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
  ) : restaurants ? (
    <Flex
      w="100%"
      backgroundColor={theme.primaryBackground}
      minHeight="90vh"
      flexDirection="column"
      alignItems="center"
    >
      <Flex w="100%" alignItems="flex-end" justifyContent="center">
        <Heading
          fontSize="2xl"
          fontWeight="medium"
          color={theme.primaryForeground}
          mt="24px"
        >
          Restaurant List
        </Heading>
        <Button
          onClick={() => navigate("/restaurant/reservations")}
          style={{ marginLeft: "50px" }}
        >
          View Reservations
        </Button>
        <Button
          onClick={() => navigate("/restaurant/book")}
          style={{ marginLeft: "10px" }}
        >
          Book Reservation
        </Button>
      </Flex>

      <Flex
        w="90%"
        flexDirection="column"
        mt="24px"
        gap="16px"
        alignItems="center"
      >
        {restaurants?.map((restaurant, ind) => {
          return (
            <button
              key={`rest-list-${ind}`}
              onClick={() => navigate(`${restaurant.restaurant_id}`)}
            >
              <Flex
                flexDirection="column"
                border="2px"
                width="720px"
                borderColor={theme.secondaryForeground}
                bgColor={theme.accent}
                borderRadius="8px"
                padding="24px"
              >
                <Text fontSize="2xl" fontWeight="semibold">
                  {getDiscountById(restaurant)} 
                </Text>
                <Text>Rating {restaurant.google_rating}</Text>
              </Flex>
            </button>
          );
        })}
      </Flex>
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

const RestaurantListPage = AuthCheck(RestaurantList, false, true);
export default RestaurantListPage;
