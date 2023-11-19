import React, { useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { AuthCheck } from "../Authentication/AuthCheck";

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    twitter: "",
    menu: {
      main_course: [],
      starter: [],
      desert: [],
      menu_id: "",
      drinks: [],
    },
    opening_time: "",
    instagram: "",
    phone_no: "",
    restaurant_id: "",
    image: "",
    restaurant_name: "",
    address: "",
    closing_time: "",
    google_rating: "",
    reviews: [],
    availability: true,
    max_tables: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMenuChange = (category, index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      menu: {
        ...prevData.menu,
        [category]: [
          ...prevData.menu[category].slice(0, index),
          value,
          ...prevData.menu[category].slice(index + 1),
        ],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any necessary actions with the form data
    console.log(formData);
  };

  return (
    <Flex
      minW="100vw"
      mt="8"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Heading alignSelf="center">Register Restaurant</Heading>
      <VStack width="1080px" spacing="4">
        <FormControl>
          <FormLabel>Restaurant Name:</FormLabel>
          <Input
            type="text"
            name="restaurant_name"
            value={formData.restaurant_name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Address:</FormLabel>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Phone Number:</FormLabel>
          <Input
            type="text"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Twitter:</FormLabel>
          <Input
            type="text"
            value={formData.menu.main_course[0]}
            onChange={(e) => handleMenuChange("main_course", 0, e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Instagram:</FormLabel>
          <Input
            type="text"
            value={formData.menu.starter[0]}
            onChange={(e) => handleMenuChange("starter", 0, e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Opening Time:</FormLabel>
          <Input
            type="text"
            value={formData.menu.starter[0]}
            onChange={(e) => handleMenuChange("starter", 0, e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Closing Time:</FormLabel>
          <Input
            type="text"
            value={formData.menu.starter[0]}
            onChange={(e) => handleMenuChange("starter", 0, e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Availability:</FormLabel>
          <Input
            type="text"
            value={formData.menu.starter[0]}
            onChange={(e) => handleMenuChange("starter", 0, e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Maximum tables:</FormLabel>
          <Input
            type="text"
            value={formData.menu.starter[0]}
            onChange={(e) => handleMenuChange("starter", 0, e.target.value)}
          />
        </FormControl>

        <Button colorScheme="teal" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </VStack>
    </Flex>
  );
};

const RestaurantFormPage = AuthCheck(RestaurantForm);
export default RestaurantFormPage;
