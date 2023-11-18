const AWS = require("aws-sdk");
const Responses = require("../../../menu/lambdas/common/API_Responses");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.restaurantRatingsTableName;

exports.handler = async (event) => {
  try {
    const { restaurantId, rating } = JSON.parse(event.body);

    if (!restaurantId || !rating || rating < 1 || rating > 5) {
      return Responses._400({
        message:
          "Invalid input. Restaurant ID and rating are required, and rating must be between 1 and 5.",
      });
    }

    const params = {
      TableName: Menu,
      Item: {
        restaurantId: restaurantId,
        rating: rating,
      },
    };

    await dynamoDb.put(params).promise();

    return Responses._200({ message: "Rating submitted successfully." });
  } catch (error) {
    console.error("Error submitting restaurant rating:", error);
    return Responses._500({ message: "Internal Server Error" });
  }
};
