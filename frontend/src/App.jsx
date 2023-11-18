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
        element: <ReservationForm />,
      },
      {
        path: "/restaurant/reservations",
        element: <Reservations />,
      },
      {
        path: "/restaurant/book/:reservationId",
        element: <ReservationForm />,
      },
      {
        path: "/partner/menu/:restaurantId",
        element: (
          <>
            <DisplayMenu />
          </>
        ),
      },
      {
        path: "/partner/manage-menu/:restaurantId",
        element: (
          <>
            <RestaurantMenuManager />
          </>
        ),
      },
    ],
  },
  {
    element: <LayoutWithoutNavbar />,
    children: [
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
        path: "/user/signup",
        element: <SignUp />,
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
