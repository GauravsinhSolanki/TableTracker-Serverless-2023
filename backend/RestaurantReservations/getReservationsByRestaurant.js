const admin = require("firebase-admin");
const Responses = require("./ApiResponses");
const serviceAccount = require("./sdp3-firestore.json"); // file path for service account credentials

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci5410-f23-sdp3.firebaseio.com", // Firebase project URL
});

exports.handler = async (event, context) => {
  try {
    const db = admin.firestore();
    const restaurantId = event.queryStringParameters.restaurant_id ?? "R1";
    const dbCollection = db.collection("RestaurantReservations");
    const userId = event.queryStringParameters.user_id ?? null;

    let reservationsDocs = null;

    if (!restaurantId) {
      return Responses._400({
        message: "Restaurant does not exist.",
      });
    }

    if (!userId) {
      reservationsDocs = await dbCollection
        .where("restaurant_id", "==", restaurantId)
        .get();
    } else {
      reservationsDocs = await dbCollection
        .where("restaurant_id", "==", restaurantId)
        .where("user_id", "==", userId)
        .get();
    }

    if (reservationsDocs.empty) {
      return Responses._400({
        message: "No reservations found for this restaurant.",
      });
    }

    const reservations = reservationsDocs.docs.map((document) => ({
      id: document.id,
      ...document.data(),
      reservation_date: document.data().reservation_date.toDate(),
    }));

    return Responses._200({
      message: "Fetched reservations successfully",
      data: [...reservations],
    });
  } catch (error) {
    console.log(error);
    return Responses._400({
      message: "Error fetching restaurant reservations",
      error: error.message,
    });
  }
};
