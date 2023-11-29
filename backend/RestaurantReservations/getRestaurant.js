const admin = require("firebase-admin");
const Responses = require("./ApiResponses");
const serviceAccount = require("./sdp3-firestore.json"); // file path for service account credentials

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csci5410-f23-sdp3.firebaseio.com", // Firebase project URL
});

exports.handler = async (event) => {
  try {
    const db = admin.firestore();
    const restaurantId = event.queryStringParameters.restaurant_id ?? null;
    const restaurantRef = db.collection("Restaurants").doc(restaurantId);
    const doc = await restaurantRef.get();

    if (doc.exists) {
      return Responses._200({
        message: `Restaurant with ID ${restaurantId} processed successfully.`,
        data: doc.data(),
      });
    } else {
      return Responses._400({
        message: `Restaurant with ID ${restaurantId} not found.`,
      });
    }
  } catch (error) {
    console.error("Error retrieving restaurant details: ", error);
    return Responses._400({
      message: "Error retrieving restaurant details.",
    });
  }
};
