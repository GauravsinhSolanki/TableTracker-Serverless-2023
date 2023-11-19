const axios = require("axios");
const Responses = require("../../../menu/lambdas/common/API_Responses");

exports.handler = async (event) => {
  try {
    //get restaurant details
    const response = await axios.get(
      `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants`
    );

    //successful:
    if (response.status === 200) {
      const restaurantDetails = response.data;
      return Responses._200({ restaurant: restaurantDetails });
    } else {
      // failed:
      return Responses._500({ message: "Failed to fetch restaurant details" });
    }
  } catch (error) {
    // Error:
    console.error("Error:", error);
    return Responses._500({ message: "Internal Server Error" });
  }
};
