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

export const getFirestoreRestaurant = async (restaurant_id) => {
  try {
    const response = await axios.get(
      `https://9rx9l2d2a9.execute-api.us-east-1.amazonaws.com/dev/fetch-restaurant?restaurant_id=${restaurant_id}`
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};

export const createRestaurantReview = async (restaurant_id, review) => {
  try {
    const response = await axios.post(
      `https://u8c37iy6zk.execute-api.us-east-1.amazonaws.com/dev/create-restaurant-review?restaurant_id=${restaurant_id}`,
      {
        ...review,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating restaurant", error);
    return { error: true, message: error?.response?.data?.message ?? "" };
  }
};
