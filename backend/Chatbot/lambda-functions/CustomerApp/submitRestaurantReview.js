"use strict";

const AWS = require("aws-sdk");
const Responses = require("../../../menu/lambdas/common/API_Responses");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.restaurantReviewsTableName;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { restaurantId, userId, review } = body;

    if (!restaurantId || !userId || !review) {
      return Responses._400({
        message:
          "Invalid request. Restaurant ID, User ID, and Review are required.",
      });
    }

    const params = {
      TableName: tableName,
      Item: {
        restaurantId: restaurantId,
        userId: userId,
        review: review,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDb.put(params).promise();

    return Responses._200({
      message: "Restaurant review submitted successfully.",
    });
  } catch (error) {
    console.error("Error submitting restaurant review:", error);
    return Responses._500({ message: "Internal Server Error" });
  }
};
