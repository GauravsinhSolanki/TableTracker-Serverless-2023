import axios from "axios";

export const getRestaurants = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants`,
      options
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return null;
  }
};

export const getRestaurantsByID = async (restaurant_id) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants/${restaurant_id}`,
      options
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};

export const updateRestaurant = async (request) => {
  try {
    const response = await axios.post(
      `https://pvtzkffds5.execute-api.us-east-1.amazonaws.com/dev/restaurant-update`,
      {
        ...request,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating restaurant", error);
    return { error: true, message: error?.response?.data?.message ?? "" };
  }
};
