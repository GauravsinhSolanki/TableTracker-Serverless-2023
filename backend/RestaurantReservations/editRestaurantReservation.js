var admin = require("firebase-admin");
const axios = require("axios");
var serviceAccount = require("./sdp3-firestore.json");
const Responses = require("./ApiResponses");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const reservationDetails = JSON.parse(event.body);
    const {
      reservationId,
      restaurantId,
      reservationDate,
      requiredCapacity,
      userId,
      isApproved,
    } = reservationDetails;

    const reservationDocRef = db
      .collection("RestaurantReservations")
      .doc(reservationId);
    const reservation = await reservationDocRef.get();

    if (!reservation.exists) {
      return Responses._400({
        message: "Restaurant reservation does not exist",
      });
    }

    const currentReservationData = { ...reservation.data() };

    const currentDate = new Date();
    const currentUtcDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
      )
    );
    const currentReservationDate =
      currentReservationData.reservation_date.toDate();
    const reservationUtcDate = new Date(
      Date.UTC(
        currentReservationDate.getUTCFullYear(),
        currentReservationDate.getUTCMonth(),
        currentReservationDate.getUTCDate(),
        currentReservationDate.getUTCHours(),
        currentReservationDate.getUTCMinutes(),
        currentReservationDate.getUTCSeconds()
      )
    );

    console.log(currentReservationData);
    if ((reservationUtcDate - currentUtcDate) / (1000 * 60) >= 60) {
      const response = await axios.get(
        `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants/${currentReservationData.restaurant_id}`
      );
      const restaurantDetails = response.data;

      if (
        currentReservationData.restaurant_id !== restaurantDetails.restaurant_id
      ) {
        return Responses._400({
          message: "The restaurant does not exist",
        });
      }

      const restaurantOpening = restaurantDetails.opening_time;
      const restaurantClosing = restaurantDetails.closing_time;
      const [openingHour, openingMinute] = restaurantOpening
        .split(":")
        .map(Number);
      const [closingHour, closingMinute] = restaurantClosing
        .split(":")
        .map(Number);

      // Create opening and closing date from reservation date and restaurant timings
      let newReservationDate = new Date(reservationDate);
      if (!reservationDate) {
        newReservationDate = currentReservationDate;
      }
      const openingDate = new Date(newReservationDate);
      const closingDate = new Date(newReservationDate);
      openingDate.setHours(openingHour, openingMinute, 0, 0);
      closingDate.setHours(closingHour, closingMinute, 0, 0);

      // Adjust for closing times past midnight
      if (restaurantClosing < restaurantOpening) {
        closingDate.setDate(closingDate.getDate() + 1);
      }

      if (
        newReservationDate >= openingDate &&
        newReservationDate <= closingDate
      ) {
        let updatedReservation = {};

        if (restaurantId) {
          updatedReservation.restaurant_id = restaurantId;
        }

        if (newReservationDate) {
          updatedReservation.reservation_date =
            admin.firestore.Timestamp.fromDate(newReservationDate);
        }

        if (requiredCapacity) {
          updatedReservation.required_capacity = requiredCapacity;
        }

        if (userId) {
          updatedReservation.user_id = userId;
        }

        if (isApproved !== undefined && isApproved !== null) {
          updatedReservation.isApproved = isApproved;
        }

        await reservationDocRef.update(updatedReservation);

        return Responses._200({
          message: "Reservation edited successfully",
        });
      } else {
        return Responses._400({
          message: "Reservation time is outside the restaurant's opening hours",
        });
      }
    } else {
      return Responses._400({
        message:
          "Reservations can only be edited 1 hour before the reservation time.",
      });
    }
  } catch (error) {
    console.log(error);
    return Responses._400({
      message: "Error booking restaurant reservations",
      error: error.message,
    });
  }
};
