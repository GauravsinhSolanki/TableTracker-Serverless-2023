var admin = require("firebase-admin");
const axios = require("axios");
var serviceAccount = require("./sdp3-firestore.json");
const Responses = require("./ApiResponses");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci5410-f23-sdp3.firebaseio.com",
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    const intentName = event.currentIntent.name;
    const slots = event.currentIntent.slots;

    switch (intentName) {
      case "BookReservation":
        return await bookReservation(slots);
      case "EditReservation":
        return await editReservation(slots);
      case "CancelReservation":
        return await cancelReservation(slots);
      default:
        return Responses._400({ message: "Invalid intent" });
    }
  } catch (error) {
    console.log(error);
    return Responses._400({ message: "Error processing your request" });
  }
};

async function bookReservation(slots) {
  const { RestaurantId, ReservationDate, RequiredCapacity, UserId } = slots;
  const newReservationDate = new Date(ReservationDate);

  const response = await axios.get(
    `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants/${RestaurantId}`
  );
  const restaurantDetails = response.data;

  if (RestaurantId !== restaurantDetails.restaurant_id) {
    return Responses._400({ message: "The restaurant does not exist" });
  }

  const restaurantOpening = restaurantDetails.opening_time;
  const restaurantClosing = restaurantDetails.closing_time;
  const [openingHour, openingMinute] = restaurantOpening.split(":").map(Number);
  const [closingHour, closingMinute] = restaurantClosing.split(":").map(Number);

  const openingDate = new Date(newReservationDate);
  const closingDate = new Date(newReservationDate);
  openingDate.setHours(openingHour, openingMinute, 0, 0);
  closingDate.setHours(closingHour, closingMinute, 0, 0);

  if (restaurantClosing < restaurantOpening) {
    closingDate.setDate(closingDate.getDate() + 1);
  }

  if (newReservationDate < openingDate || newReservationDate > closingDate) {
    return Responses._400({
      message: "Reservation time is outside the restaurant's opening hours",
    });
  }

  const reservationsDocs = db.collection("RestaurantReservations");
  const addedReservation = await reservationsDocs.add({
    restaurant_id: RestaurantId,
    reservation_date: admin.firestore.Timestamp.fromDate(newReservationDate),
    required_capacity: RequiredCapacity,
    user_id: UserId,
  });

  return Responses._200({
    message: "Reservation successful",
    reservation_id: addedReservation.id,
  });
}

async function editReservation(slots) {
  const {
    ReservationId,
    RestaurantId,
    ReservationDate,
    RequiredCapacity,
    UserId,
  } = slots;
  const reservationDocRef = db
    .collection("RestaurantReservations")
    .doc(ReservationId);
  const reservation = await reservationDocRef.get();

  if (!reservation.exists) {
    return Responses._400({ message: "Restaurant reservation does not exist" });
  }

  const newReservationDate = ReservationDate
    ? new Date(ReservationDate)
    : reservation.data().reservation_date.toDate();
  const updatedReservation = {
    restaurant_id: RestaurantId || reservation.data().restaurant_id,
    reservation_date: admin.firestore.Timestamp.fromDate(newReservationDate),
    required_capacity: RequiredCapacity || reservation.data().required_capacity,
    user_id: UserId || reservation.data().user_id,
  };

  await reservationDocRef.update(updatedReservation);

  return Responses._200({ message: "Reservation edited successfully" });
}

async function cancelReservation(slots) {
  const reservationId = slots.ReservationId;
  const reservationDocRef = db
    .collection("RestaurantReservations")
    .doc(reservationId);
  await reservationDocRef.delete();

  return Responses._200({ message: "Reservation successfully deleted!" });
}
