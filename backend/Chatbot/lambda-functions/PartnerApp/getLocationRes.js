"use strict";
const Responses = require("../../../menu/lambdas/common/API_Responses"); // Adjust path as necessary
const Dynamo = require("../../../menu/lambdas/Dynamo"); // Adjust path as necessary

const tableName = process.env.restaurantTableName; // Set this environment variable in your Lambda function

exports.handler = async (event) => {
  try {
    // Extracting the restaurant ID from Lex slots
    const restaurantId = event.currentIntent.slots.RestaurantId;

    if (!restaurantId) {
      return Responses._400({ message: "Restaurant ID is required" });
    }

    const params = {
      TableName: tableName,
      Key: {
        id: restaurantId,
      },
    };

    const restaurantData = await Dynamo.get(params).catch((err) => {
      console.error(err);
      return null;
    });

    if (!restaurantData || !restaurantData.Item) {
      return Responses._400({
        message: "Restaurant not found or no location information available",
      });
    }

    const { address } = restaurantData.Item;

    return Responses._200({
      message: "Retrieved location information successfully",
      address: address,
    });
  } catch (error) {
    console.error(error);
    return Responses._400({
      message: "Failed to retrieve location information",
    });
  }
};
