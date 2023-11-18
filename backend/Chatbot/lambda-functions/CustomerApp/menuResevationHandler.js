"use strict";

const axios = require("axios");
const Responses = require("../../../menu/lambdas/common/API_Responses");
// const Dynamo = require("../../menu/lambdas/common/Dynamo");
const reservationApiBaseUrl =
  "https://xp3qns9hlf.execute-api.us-east-2.amazonaws.com/dev/create-menu-reservation";

exports.handler = async (event) => {
  try {
    // Extract Slots
    const restaurantName = event.slots.RestaurantName;
    const reservationDate = event.slots.Date;
    const reservationTime = event.slots.Time;

    // Make a reservation request
    const reservationRequest = {
      restaurantName: restaurantName,
      reservationDate: reservationDate,
      reservationTime: reservationTime,
    };

    // Make a POST request to create a reservation
    const createReservationResponse = await axios.post(
      `${reservationApiBaseUrl}/reservations`,
      reservationRequest
    );

    if (createReservationResponse.status === 201) {
      // Reservation created successfully
      const reservationData = createReservationResponse.data;

      // Implement CRUD operations for menu reservations (assuming menuItemId and quantity are provided)
      const menuReservations = [
        { menuItemId: 1, quantity: 2 },
        { menuItemId: 2, quantity: 5 },
      ];

      // Make a POST request to create menu reservations
      const createMenuReservationResponse = await axios.post(
        `${reservationApiBaseUrl}/menu-reservations`,
        {
          reservationId: reservationData.reservationId,
          menuReservations: menuReservations,
        }
      );

      if (createMenuReservationResponse.status === 201) {
        // Menu reservations created successfully
        const confirmationMessage = `Your reservation at ${restaurantName} on ${reservationDate} at ${reservationTime} is confirmed. Enjoy your meal!`;
        return Responses._200({ message: confirmationMessage });
      } else {
        // Failed to create menu reservations
        return Responses._400({
          message: "Failed to create menu reservations. Please try again.",
        });
      }
    } else {
      // Failed to create reservation
      return Responses._400({
        message: "Failed to create reservation. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    return Responses._500({ message: "Internal Server Error" });
  }
};
