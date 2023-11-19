const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { menuItemId, userId, reviewText } = JSON.parse(event.body);

  if (!menuItemId || !userId || !reviewText) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message:
          "Invalid input. Please provide menuItemId, userId, and reviewText.",
      }),
    };
  }

  const reviewId = uuidv4(); // unique review ID:

  const params = {
    TableName: "Menu",
    Item: {
      reviewId: reviewId,
      menuItemId: menuItemId,
      userId: userId,
      reviewText: reviewText,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Review submitted successfully.",
        reviewId: reviewId,
      }),
    };
  } catch (error) {
    console.error("Error submitting menu review:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
