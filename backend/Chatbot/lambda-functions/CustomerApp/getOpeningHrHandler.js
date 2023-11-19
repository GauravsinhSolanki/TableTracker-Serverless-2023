// const axios = require("axios");
const Responses = require("../../../menu/lambdas/common/API_Responses");

exports.handler = async (event) => {
  try {
    const { restaurant_id } = event.pathParameters;
    const response = await axios.get(
      `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants/${restaurant_id}`
    );

    //successful:
    if (response.status === 200) {
      const restaurant = response.data;

      // Extract opening and closing times:
      const { opening_time, closing_time } = restaurant;

      // Return opening times:
      return Responses._200({ opening_time, closing_time });
    } else {
      // failed:
      return Responses._500({ message: "Failed to fetch restaurant data" });
    }
  } catch (error) {
    console.error("Error:", error);
    return Responses._500({ message: "Internal Server Error" });
  }
};
