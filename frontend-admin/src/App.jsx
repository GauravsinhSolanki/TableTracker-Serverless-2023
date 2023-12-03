import { ChakraProvider, theme } from "@chakra-ui/react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Customer/Authentication/Login";
import LayoutWithNavbar from "./Pages/Customer/Layout/LayoutWithNavbar";
import LayoutWithoutNavbar from "./Pages/Customer/Layout/LayoutWithoutNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import KommunicateChat from "./Pages/Customer/ChatBot/chat";
import RestaurantReviews from "./Pages/Admin/RestaurantReviews";
import RestaurantMostOrders from "./Pages/Admin/RestaurantMostOrders";
import FoodMostOrderedTime from "./Pages/Admin/FoodMostOrderedTime";
import Top10Orders from "./Pages/Admin/Top10Orders";
import TopCustomers from "./Pages/Admin/TopCustomers";

const router = createBrowserRouter([
  {
    element: <LayoutWithNavbar />,
    children: [
      {
        path: "/admin/restaurant-reviews",
        element: (
          <>
            <KommunicateChat />
            <RestaurantReviews />
          </>
        ),
      },
      {
        path: "/admin/restaurant-most-orders",
        element: (
          <>
            <KommunicateChat />
            <RestaurantMostOrders />
          </>
        ),
      },
      {
        path: "/admin/food-most-ordered-time",
        element: (
          <>
            <KommunicateChat />
            <FoodMostOrderedTime />
          </>
        ),
      },
      {
        path: "/admin/top10-orders",
        element: (
          <>
            <KommunicateChat />
            <Top10Orders />
          </>
        ),
      },
      {
        path: "/admin/topcustomers",
        element: (
          <>
            <KommunicateChat />
            <TopCustomers />
          </>
        ),
      },
    ],
  },
  {
    element: <LayoutWithoutNavbar />,
    children: [
      {
        path: "/",
        element: <Navigate to="/admin/login" />,
      },
      {
        path: "/admin/login",
        element: (
          <>
            <Login />
            <KommunicateChat />
          </>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
