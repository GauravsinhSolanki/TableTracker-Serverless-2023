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
    const reservationId = event.pathParameters.id;

    const reservationDocRef = db
      .collection("RestaurantReservations")
      .doc(reservationId);
    const reservation = await reservationDocRef.get();

    if (!reservation.exists) {
      return Responses._400({
        message: "Restaurant reservation does not exist",
      });
    }

    await reservationDocRef.delete();
    return Responses._200({
      message: "Reservation successfully deleted!",
    });
  } catch (error) {
    console.log(error);
    return Responses._400({
      message: "Error deleting restaurant reservations",
      error: error.message,
    });
  }
};
