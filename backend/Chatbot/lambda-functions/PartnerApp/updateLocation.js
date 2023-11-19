"use strict";
const Responses = require("../../../menu/lambdas/common/API_Responses"); 
const Dynamo = require("../../../menu/lambdas/Dynamo"); 

const tableName = process.env.restaurantTableName; 
exports.handler = async (event) => {
  try {
    const restaurantId = event.currentIntent.slots.RestaurantId;
    const newAddress = event.currentIntent.slots.NewAddress;

    if (!restaurantId || !newAddress) {
      return Responses._400({
        message: "Missing required information (Restaurant ID, New Address)",
      });
    }

    const updateParams = {
      TableName: tableName,
      Key: {
        id: restaurantId,
      },
      UpdateExpression: "SET address = :newAddress",
      ExpressionAttributeValues: {
        ":newAddress": newAddress,
      },
    };

    await Dynamo.update(updateParams);

    return Responses._200({
      message: "Restaurant location updated successfully",
    });
  } catch (error) {
    console.error(error);
    return Responses._400({ message: "Failed to update restaurant location" });
  }
};
