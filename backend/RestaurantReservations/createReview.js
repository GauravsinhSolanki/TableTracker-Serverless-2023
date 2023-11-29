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
    const reviewData = JSON.parse(event.body);
    const restaurantId = event.queryStringParameters.restaurant_id ?? null;

    const restaurantRef = db.collection("Restaurants").doc(restaurantId);
    const doc = await restaurantRef.get();

    if (doc.exists) {
      let restaurantData = doc.data();

      // Add new review
      restaurantData.reviews = restaurantData.reviews || [];
      restaurantData.reviews.push(reviewData);

      // Calculate new average rating
      const totalRating = restaurantData.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const newAverageRating = totalRating / restaurantData.reviews.length;

      // Update restaurant data
      await restaurantRef.update({
        reviews: restaurantData.reviews,
        rating: newAverageRating,
      });

      // Return the new rating
      return Responses._200({
        message: `Restaurant with ID ${restaurantId} processed successfully.`,
        data: { updatedRating: newAverageRating },
      });
    } else {
      return Responses._400({
        message: `Restaurant with ID ${restaurantId} not found.`,
      });
    }
  } catch (error) {
    console.error("Error adding review and updating rating:", error);
    return Responses._400({
      message: "Error adding review and updating rating.",
    });
  }
};
