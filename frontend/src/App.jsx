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

const router = createBrowserRouter([
  {
    element: <LayoutWithNavbar />,
    children: [
      {
        path: "/",
        element: <LandingPage />
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
  }

]);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
