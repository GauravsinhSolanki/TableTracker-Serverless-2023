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
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../Authentication/firebase";
import { updateRestaurant } from "../../../Services/RestaurantServices/RestaurantServices";

const RestaurantForm = () => {
  const navigate = useNavigate();

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
    restaurant_id: crypto.randomUUID(),
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
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants`,
        {
          ...formData,
        }
      );

      const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
      const userCollectionRef = collection(db, "userDetails");
      const userDocRef = doc(userCollectionRef, userDetails.uid);
      updateDoc(userDocRef, {
        restaurant_id: formData.restaurant_id,
        restaurant_name: formData.restaurant_name,
      });
      userDetails.restaurant_id = formData.restaurant_id;
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      const updateResponse = await updateRestaurant({
        restaurant_id: formData.restaurant_id,
        restaurant_name: formData.restaurant_name,
        opening_time: formData.opening_time,
        closing_time: formData.closing_time,
        max_tables: Number(formData.max_tables),
      });
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
    }
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
            name="twitter"
            type="text"
            value={formData.twitter}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Instagram:</FormLabel>
          <Input
            name="instagram"
            type="text"
            value={formData.instagram}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Opening Time:</FormLabel>
          <Input
            name="opening_time"
            type="text"
            value={formData.opening_time}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Closing Time:</FormLabel>
          <Input
            name="closing_time"
            type="text"
            value={formData.closing_time}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Availability:</FormLabel>
          <Input
            name="availability"
            type="text"
            value={formData.availability}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Maximum tables:</FormLabel>
          <Input
            name="max_tables"
            type="text"
            value={formData.max_tables}
            onChange={handleChange}
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
