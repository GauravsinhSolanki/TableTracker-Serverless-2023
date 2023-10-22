import {
  ChakraProvider,
  theme
} from '@chakra-ui/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Authentication/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import LayoutWithNavbar from './Pages/Layout/LayoutWithNavbar';
import LayoutWithoutNavbar from './Pages/Layout/LayoutWithoutNavbar';
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


]);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
