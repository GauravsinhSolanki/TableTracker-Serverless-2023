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
    const { reservationId } = reservationDetails;

    const reservationDocRef = db
      .collection("RestaurantReservations")
      .doc(reservationId);
    const reservation = await reservationDocRef.get();

    if (!reservation.exists) {
      return Responses._400({
        message: "Restaurant reservation does not exist",
      });
    }

    const updatedReservation = { ...reservation.data(), isApproved: false };

    await reservationDocRef.update(updatedReservation);

    return Responses._200({
      message: "Reservation rejected",
    });
  } catch (error) {
    console.log(error);
    return Responses._400({
      message: "Error editing restaurant reservations",
      error: error.message,
    });
  }
};
