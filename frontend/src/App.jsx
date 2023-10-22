import {
  ChakraProvider,
  theme
} from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Pages/Customer/Authentication/Login';
import LandingPage from './Pages/Customer/LandingPage/LandingPage';
import LayoutWithNavbar from './Pages/Customer/Layout/LayoutWithNavbar';
import LayoutWithoutNavbar from './Pages/Customer/Layout/LayoutWithoutNavbar';
import ViewMenu from './Pages/Customer/Menu/ViewMenu';
import 'bootstrap/dist/css/bootstrap.min.css';

import Restaurant from './Pages/Restaurant/Restaurant';
import RestaurantList from './Pages/Restaurant/RestaurantList';

const router = createBrowserRouter([
  {
    element: <LayoutWithNavbar />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/restaurantList",
        element: <RestaurantList />
      },
      {
        path: "/restaurantList/:restaurant_id",
        element: <Restaurant />
      },
    ]
  },
  {
    element: <LayoutWithoutNavbar />,
    children: [
      {
        path: "/user/login",
        element: <Login />
      },

    ]
  },
  {
    element: <LayoutWithNavbar />,
    children: [
      {
        path: "/customer/menu/:restaurantId/:reservationId",
        element: <ViewMenu />
      },

    ]
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
