import axios from "axios";

export const getReservations = async () => {
  const userId = sessionStorage.getItem("uId");
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://zsdz149rv0.execute-api.us-east-1.amazonaws.com/Dev/restaurant-reservations/list/${userId}`
    );

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};

export const getReservationsById = async (reservationId) => {
  const userId = sessionStorage.getItem("uId");
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://gw8fpox6c3.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations/${reservationId}`
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};

export const bookReservations = async (restaurantId) => {
  const userId = sessionStorage.getItem("uId");
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.post(
      `https://4g2fc8txa1.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations/book`,
      {
        reservationDate: "2023-10-29 21:00:00",
        requiredCapacity: 5,
        restaurantId,
        userId,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};

export const editReservation = async (reservationId) => {
  const userId = sessionStorage.getItem("uId");
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.put(
      `https://sitynadyuf.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations/edit`,
      {
        reservationId,
        reservationDate: "2023-10-29 21:00:00",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};

export const deleteReservation = async (reservationId) => {
  try {
    const response = await axios.delete(
      `https://snv4smf89c.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations/delete/${reservationId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};
