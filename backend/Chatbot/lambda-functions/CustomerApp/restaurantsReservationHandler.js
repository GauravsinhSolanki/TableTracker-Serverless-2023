"use strict";

const axios = require("axios");
const Responses = require("../../../RestaurantReservations/ApiResponses");

const reservationApiBaseUrl =
  "jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants";

exports.handler = async (event) => {
  try {
    const { operation, reservationId, data } = event.body;

    switch (operation) {
      case "create":
        //new:
        const createReservationResponse = await axios.post(
          `${reservationApiBaseUrl}/reservations`,
          data
        );
        if (createReservationResponse.status === 201) {
          const reservation = createReservationResponse.data;
          return Responses._201({ reservation: reservation });
        } else {
          return Responses._400({
            message: "Failed to create reservation. Please try again.",
          });
        }

      case "update":
        // Update:
        const updateReservationResponse = await axios.put(
          `${reservationApiBaseUrl}/reservations/${reservationId}`,
          data
        );
        if (updateReservationResponse.status === 200) {
          const updatedReservation = updateReservationResponse.data;
          return Responses._200({ reservation: updatedReservation });
        } else {
          return Responses._400({
            message: "Failed to update reservation. Please try again.",
          });
        }

      case "delete":
        // Delete:
        const deleteReservationResponse = await axios.delete(
          `${reservationApiBaseUrl}/reservations/${reservationId}`
        );
        if (deleteReservationResponse.status === 200) {
          return Responses._200({
            message: "Reservation deleted successfully.",
          });
        } else {
          return Responses._400({
            message: "Failed to delete reservation. Please try again.",
          });
        }

      case "get":
        // Get reservation --> by ID
        const getReservationResponse = await axios.get(
          `${reservationApiBaseUrl}/reservations/${reservationId}`
        );
        if (getReservationResponse.status === 200) {
          const reservationDetails = getReservationResponse.data;
          return Responses._200({ reservation: reservationDetails });
        } else {
          return Responses._400({
            message: "Failed to fetch reservation details. Please try again.",
          });
        }

      default:
        return Responses._400({
          message: "Invalid operation. Please provide a valid CRUD operation.",
        });
    }
  } catch (error) {
    console.error("Error processing reservation:", error);
    return Responses._500({ message: "Internal Server Error" });
  }
};
