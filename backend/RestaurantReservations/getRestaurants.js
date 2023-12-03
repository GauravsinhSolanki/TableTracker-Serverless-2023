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
    const restaurantRef = db.collection("Restaurants");
    const restaurantListRef = await restaurantRef.get();
    const restaurants = restaurantListRef.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    return Responses._200({
      message: `Restaurants fetched successfully.`,
      data: restaurants,
    });
  } catch (error) {
    console.error("Error retrieving restaurants: ", error);
    return Responses._400({
      message: "Error retrieving restaurants.",
    });
  }
};
