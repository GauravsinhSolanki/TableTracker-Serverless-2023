var admin = require("firebase-admin");
var serviceAccount = require("./sdp3-firestore.json");
const Responses = require("./ApiResponses");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci5410-f23-sdp3.firebaseio.com", // Firebase project URL
});

exports.handler = async (event) => {
  try {
    const db = admin.firestore();
    const reservationId = event.pathParameters.id;
    const reservation = await db
      .collection("RestaurantReservations")
      .doc(reservationId)
      .get();

    if (!reservation.exists) {
      return Responses._400({
        message: "Restaurant reservation does not exist",
      });
    }

    const reservationData = { ...reservation.data() };
    return Responses._200({
      message: "Fetched reservation successfully",
      data: {
        ...reservationData,
        reservation_date: reservationData.reservation_date.toDate(),
        id: reservationId,
      },
    });
  } catch (error) {
    console.log(error);
    return Responses._400({
      message: "Error fetching restaurant reservation by id",
      error: error.message,
    });
  }
};
