import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getHolisticData } from "../../../Services/ReservationService/ReservationService";
import { Spinner } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const WeeklyChart = () => {
  const [weeklyData, setWeeklyData] = useState({ labels: [], datasets: [] });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    setLoading(true);
    const user = JSON.parse(sessionStorage.getItem("userDetails"));
    if (user?.restaurant_id) {
      const response = await getHolisticData(user.restaurant_id, "weekly");

      const { labels, graphData } = transformData(response?.data ?? []);
      const dataset = {
        labels,
        datasets: [...graphData],
      };
      setWeeklyData({ ...dataset });
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  }

  return <Bar options={options} data={weeklyData} />;
};

const transformData = (data) => {
  const labels = [];
  const reservationData = [];
  const tablesData = [];

  for (const reservation of data) {
    labels.push(reservation.key);
    reservationData.push(reservation.totalReservations);
    tablesData.push(reservation.totalTables);
  }

  const graphData = [
    {
      label: "Total Reservations",
      data: [...reservationData],
      backgroundColor: "#2e59a8",
    },
    {
      label: "Total Tables",
      data: [...tablesData],
      backgroundColor: "#a5d5d8",
    },
  ];

  return { labels, graphData };
};

export default WeeklyChart;
