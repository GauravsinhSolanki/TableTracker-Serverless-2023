"use strict";
const Responses = require("../../../menu/lambdas/common/API_Responses"); // Updated
const Dynamo = require("../../../menu/lambdas/Dynamo");

const tableName = process.env.menuTableName;

exports.handler = async (event) => {
  try {
    // getting menu or restaurant ID from Lex slots
    const id =
      event.currentIntent.slots.MenuId ||
      event.currentIntent.slots.RestaurantId;
    if (!id) {
      return formatLexResponse("No ID specified to retrieve menu items");
    }

    const menuItems = await Dynamo.get(id, tableName).catch((error) => {
      console.log("Error fetching menu item", error);
      return null;
    });

    if (!menuItems) {
      return formatLexResponse("No matching items found for the given ID");
    }

    return formatLexResponse(`Menu items: ${JSON.stringify(menuItems)}`);
  } catch (error) {
    console.error(error);
    return formatLexResponse("Failed to fetch menu items", true);
  }
};

function formatLexResponse(message, isError = false) {
  return {
    dialogAction: {
      type: "Close",
      fulfillmentState: isError ? "Failed" : "Fulfilled",
      message: {
        contentType: "PlainText",
        content: message,
      },
    },
  };
}
