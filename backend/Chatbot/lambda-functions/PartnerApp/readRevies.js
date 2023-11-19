"use strict";
const Responses = require("../../../menu/lambdas/common/API_Responses");
const Dynamo = require("../../../menu/lambdas/Dynamo");

const tableName = process.env.restaurantTableName;

exports.handler = async (event) => {
  try {
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
        message: "Restaurant not found or no reviews available",
      });
    }

    const { reviews } = restaurantData.Item;

    return Responses._200({
      message: "Retrieved reviews successfully",
      reviews: reviews,
    });
  } catch (error) {
    console.error(error);
    return Responses._400({ message: "Failed to retrieve reviews" });
  }
};
