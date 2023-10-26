"use strict";

const Responses = require("./common/API_Responses");

const hardcodedMenuData = {
  restaurantId: "1",
  menuItems: [
    {
      id: "1",
      name: "Dish 1",
      price: 10.99,
    },
    {
      id: "2",
      name: "Dish 2",
      price: 12.99,
    },
    
  ],
};

module.exports.handler = async (event) => {
  try {
    if (!event.requestAttributes || !event.requestAttributes.sessionId) {
      return Responses._400({
        message: "Invalid request",
      });
    }

   
    const restaurantId = event.sessionState.sessionAttributes.restaurantId;

    if (!restaurantId) {
      return Responses._400({
        message: "Restaurant ID not found in session attributes",
      });
    }

    
    const menuItems = hardcodedMenuData.menuItems;

    return Responses._200(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return Responses._500({
      message: "Internal Server Error",
    });
  }
};
