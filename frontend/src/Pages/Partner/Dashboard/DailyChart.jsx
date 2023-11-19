import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getHolisticData } from "../../../Services/ReservationService/ReservationService";
import { Spinner } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

const DailyChart = () => {
  const [dailyData, setDailyData] = useState({ labels: [], datasets: [] });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetcDailyData();
  }, []);

  const fetcDailyData = async () => {
    setLoading(true);
    const user = JSON.parse(sessionStorage.getItem("userDetails"));
    if (user?.restaurant_id) {
      const response = await getHolisticData(user.restaurant_id, "daily");

      const { labels, graphData } = transformData(response?.data ?? []);
      const dataset = {
        labels,
        datasets: [...graphData],
      };
      setDailyData({ ...dataset });
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
        size="lg"
      />
    );
  }

  return <Line options={options} data={dailyData} />;
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
      borderColor: "#2e59a8",
      backgroundColor: "#2e59a8",
    },
    {
      label: "Total Tables",
      data: [...tablesData],
      borderColor: "#a5d5d8",
      backgroundColor: "#a5d5d8",
    },
  ];

  return { labels, graphData };
};

export default DailyChart;
