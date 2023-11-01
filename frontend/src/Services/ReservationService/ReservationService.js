import axios from "axios";

export const getReservations = async () => {
  const userId = sessionStorage.getItem("uId");
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://ebgxkia7b6.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations/list/${userId}`
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
      `https://h3r8u603ef.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations/${reservationId}`
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return null;
  }
};

export const bookReservations = async (request) => {
  const userId = sessionStorage.getItem("uId");
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.post(
      `https://wf7hxjb1s1.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations-book`,
      {
        ...request,
        userId,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error booking restaurants by :", error);
    return (
      error?.response?.data ??
      "Error booking restaurant. Please try again later"
    );
  }
};

export const editReservation = async (request) => {
  const userId = sessionStorage.getItem("uId");
  if (!userId) {
    return null;
  }

  try {
    const response = await axios.put(
      `https://wf7hxjb1s1.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations-edit`,
      {
        ...request,
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
      `https://i3kpyc4qwi.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations-delete/${reservationId}`
    );

    return { ...response.data, success: true };
  } catch (error) {
    console.error("Error fetching restaurants by :", error);
    return { message: error.message, success: false };
  }
};

export const formatDate = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const formatDateTime = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hours = d.getHours(),
    mins = d.getMinutes();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hours < 10) hours = "0" + hours;
  if (mins < 10) mins = "0" + mins;

  return `${[year, month, day].join("-")} ${hours}:${mins}`;
};

export const findRestInList = (restaurants, resId) => {
  if (!restaurants || restaurants.length == 0) {
    return null;
  }

  const foundRest = restaurants.filter((res) => resId === res.restaurant_id);
  return foundRest ? foundRest[0] : null;
};
