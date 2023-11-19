const admin = require("firebase-admin");
const Responses = require("../../../RestaurantReservations/ApiResponses");
const serviceAccount = require("../../../RestaurantReservations/sdp3-firestore.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci5410-f23-sdp3.firebaseio.com",
});

exports.handler = async (event) => {
  try {
    const db = admin.firestore();
    const restaurantId = event.currentIntent.slots.RestaurantId; // Get restaurant ID from Lex slots
    const timePeriod = event.currentIntent.slots.TimePeriod; // Get time period (day, week, month) from Lex slots

    const dbCollection = db.collection("RestaurantReservations");

    const { startDate, endDate } = calculateDateRange(timePeriod);

    const reservationsDocs = await dbCollection
      .where("restaurant_id", "==", restaurantId)
      .where("reservation_date", ">=", startDate)
      .where("reservation_date", "<=", endDate)
      .get();

    if (reservationsDocs.empty) {
      return Responses._400({
        message:
          "No reservations found for this restaurant in the specified period.",
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

function calculateDateRange(timePeriod) {
  let startDate = new Date();
  let endDate = new Date();

  if (timePeriod === "week") {
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(startDate.getDate() + 6);
  }

  return { startDate, endDate };
}
