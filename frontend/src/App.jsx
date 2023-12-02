import { ChakraProvider, theme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Customer/Authentication/Login";
import SignUp from "./Pages/Customer/Authentication/Signup";
import LandingPage from "./Pages/Customer/LandingPage/LandingPage";
import LayoutWithNavbar from "./Pages/Customer/Layout/LayoutWithNavbar";
import LayoutWithoutNavbar from "./Pages/Customer/Layout/LayoutWithoutNavbar";
import ViewMenu from "./Pages/Customer/Menu/ViewMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import Restaurant from "./Pages/Customer/Restaurant/Restaurant";
import RestaurantList from "./Pages/Customer/Restaurant/RestaurantList";
import ReservationForm from "./Pages/Customer/Reservation/ReservationForm";
import KommunicateChat from "./Pages/Customer/ChatBot/chat";
import Reservations from "./Pages/Customer/Reservation/Reservations";
import DisplayMenu from "./Pages/Partner/Menu/DisplayMenu";
import RestaurantMenuManager from "./Pages/Partner/Menu/RestaurantMenuManager";
import Dashboard from "./Pages/Partner/Dashboard/Dashboard";
import RestaurantForm from "./Pages/Customer/Restaurant/RestaurantForm";
import RestaurantReviews from "./Pages/Admin/RestaurantReviews";
import RestaurantMostOrders from "./Pages/Admin/RestaurantMostOrders";

const router = createBrowserRouter([
  {
    element: <LayoutWithNavbar />,
    children: [
      {
        path: "/",
        element: (
          <>
            <LandingPage />,
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/restaurantList",
        element: (
          <>
            <RestaurantList />
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/restaurantList/:restaurant_id",
        element: (
          <>
            <Restaurant />
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/restaurant/:restaurant_id",
        element: (
          <>
            <Restaurant />
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/customer/menu/:restaurantId/:reservationId",
        element: (
          <>
            <ViewMenu />
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/restaurant/book",
        element: (
          <>
            <KommunicateChat />
            <ReservationForm />
          </>
        ),
      },
      {
        path: "/restaurant/reservations",
        element: (
          <>
            <KommunicateChat />
            <Reservations />
          </>
        ),
      },
      {
        path: "/restaurant/book/:reservationId",
        element: (
          <>
            <KommunicateChat />
            <ReservationForm />
          </>
        ),
      },
      {
        path: "/partner/menu/:restaurantId",
        element: (
          <>
            <KommunicateChat />
            <DisplayMenu />
          </>
        ),
      },
      {
        path: "/partner/manage-menu/:restaurantId",
        element: (
          <>
            <KommunicateChat />
            <RestaurantMenuManager />
          </>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <>
            <KommunicateChat />
            <Dashboard />
          </>
        ),
      },
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
    ],
  },
  {
    element: <LayoutWithoutNavbar />,
    children: [
      {
        path: "/admin/login",
        element: (
          <>
            <Login />
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/user/login",
        element: (
          <>
            <Login />
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/partner/login",
        element: (
          <>
            <Login />
            <KommunicateChat />
          </>
        ),
      },
      {
        path: "/user/signup",
        element: <SignUp />,
      },
      {
        path: "/partner/signup",
        element: <SignUp />,
      },
      {
        path: "/restaurantForm",
        element: (
          <>
            <RestaurantForm />
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
