var admin = require("firebase-admin");
const axios = require("axios");
var serviceAccount = require("./sdp3-firestore.json");
const Responses = require("./ApiResponses");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci5410-f23-sdp3.firebaseio.com", // Firebase project URL
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const reservationDetails = JSON.parse(event.body);
    const { restaurantId, reservationDate, requiredCapacity, userId } =
      reservationDetails;

    const newReservationDate = new Date(reservationDate);

    const response = await axios.get(
      `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants/${restaurantId}`
    );
    const restaurantDetails = response.data;

    if (restaurantId !== restaurantDetails.restaurant_id) {
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
      const reservationsDocs = db.collection("RestaurantReservations");
      const addedReservation = await reservationsDocs.add({
        restaurant_id: restaurantId,
        reservation_date:
          admin.firestore.Timestamp.fromDate(newReservationDate),
        required_capacity: requiredCapacity,
        user_id: userId,
      });

      return Responses._200({
        message: "Reservation successful",
        reservation_id: addedReservation.id,
      });
    } else {
      return Responses._400({
        message: "Reservation time is outside the restaurant's opening hours",
      });
    }
  } catch (error) {
    console.log(error);
    return Responses._400({
      message: "Error booking restaurant reservations",
    });
  }
};
