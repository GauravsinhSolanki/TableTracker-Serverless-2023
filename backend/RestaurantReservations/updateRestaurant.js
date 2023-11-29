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
    const request = JSON.parse(event.body);
    const data = { ...request };
    const restaurantId = data?.restaurant_id ?? "";

    if (!restaurantId) {
      return Responses._200({
        message: `Restaurant with ID ${restaurantId} processed successfully.`,
        data: restaurantId,
      });
    }

    // Default values for a new restaurant
    const defaultData = {
      restaurant_id: restaurantId,
      closing_time: "10:00",
      opening_time: "21:30",
      max_tables: 10,
      rating: 0,
      reviews: [],
    };

    const restaurantRef = db.collection("Restaurants").doc(restaurantId);
    const doc = await restaurantRef.get();

    if (doc.exists) {
      // Update existing restaurant
      await restaurantRef.update(data);
    } else {
      // Create new restaurant with default values
      const newData = { ...defaultData, ...data };
      await restaurantRef.set(newData);
    }

    return Responses._200({
      message: `Restaurant with ID ${restaurantId} processed successfully.`,
      data: restaurantId,
    });
  } catch (error) {
    console.error("Error updating/creating restaurant:", error);
    return Responses._400({
      message: "Error updating/creating restaurant.",
    });
  }
};
