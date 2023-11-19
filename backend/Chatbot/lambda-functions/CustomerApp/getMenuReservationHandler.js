"use strict";

const axios = require("axios");
const Responses = require("../../../menu/lambdas/common/API_Responses");
// const Dynamo = require("../../menu/lambdas/common/Dynamo");
const reservationApiBaseUrl =
  "https://xp3qns9hlf.execute-api.us-east-2.amazonaws.com/dev/get-menu-reservation";

exports.handler = async (event) => {
  try {
    // Extract restaurant ID slot
    const restaurantId = event.slots.RestaurantId;

    // GET request  by restaurant ID
    const getReservedMenuResponse = await axios.get(
      `${reservationApiBaseUrl}/restaurants/${restaurantId}/reserved-menu`
    );

    if (getReservedMenuResponse.status === 200) {
      // Successfull:
      const reservedMenuItems = getReservedMenuResponse.data;

      return Responses._200({ reservedMenuItems: reservedMenuItems });
    } else {
      // Failed:
      return Responses._400({
        message: "Failed to fetch reserved menu items. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error fetching reserved menu items:", error);
    return Responses._500({ message: "Internal Server Error" });
  }
};
