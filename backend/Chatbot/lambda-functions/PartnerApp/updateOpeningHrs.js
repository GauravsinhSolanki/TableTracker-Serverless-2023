"use strict";
const Responses = require("../../../menu/lambdas/common/API_Responses");
const Dynamo = require("../../../menu/lambdas/Dynamo");
const tableName = process.env.restaurantTableName;

exports.handler = async (event) => {
  try {
    const restaurantId = event.currentIntent.slots.RestaurantId;
    const openingTime = event.currentIntent.slots.OpeningTime;
    const closingTime = event.currentIntent.slots.ClosingTime;

    if (!restaurantId || !openingTime || !closingTime) {
      return Responses._400({
        message:
          "Missing required information (Restaurant ID, Opening Time, Closing Time)",
      });
    }

    const updateParams = {
      TableName: tableName,
      Key: {
        id: restaurantId,
      },
      UpdateExpression:
        "SET opening_time = :openingTime, closing_time = :closingTime",
      ExpressionAttributeValues: {
        ":openingTime": openingTime,
        ":closingTime": closingTime,
      },
    };

    await Dynamo.update(updateParams);

    return Responses._200({
      message: "Restaurant opening times updated successfully",
    });
  } catch (error) {
    console.error(error);
    return Responses._400({
      message: "Failed to update restaurant opening times",
    });
  }
};
