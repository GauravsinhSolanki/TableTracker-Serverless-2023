"use strict";

const axios = require("axios");
const Responses = require("../../../menu/lambdas/common/API_Responses");
const Dynamo = require("../../../menu/lambdas/common/Dynamo");

const menuApiBaseUrl =
  "https://xp3qns9hlf.execute-api.us-east-2.amazonaws.com/dev/get-menu";
const tableName = process.env.menuTableName;

module.exports.handler = async (event) => {
  try {
    if (!event.requestAttributes || !event.requestAttributes.sessionId) {
      return Responses._400({
        message: "Invalid request",
      });
    }

    const sessionId = event.requestAttributes.sessionId;

    const restaurantId = event.sessionState.sessionAttributes.restaurantId;

    if (!restaurantId) {
      return Responses._400({
        message: "Restaurant ID not found in session attributes",
      });
    }

    const response = await axios.get(`${menuApiBaseUrl}/menu/${restaurantId}`);
    const menuItems = response.data;

    await Dynamo.put(menuItems, sessionId, tableName);

    return Responses._200(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return Responses._500({
      message: "Internal Server Error",
    });
  }
};
