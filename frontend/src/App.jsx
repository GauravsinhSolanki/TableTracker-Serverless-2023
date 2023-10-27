import {
  ChakraProvider,
  theme
} from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Pages/Customer/Authentication/Login';
import SignUp from './Pages/Customer/Authentication/Signup';
import LandingPage from './Pages/Customer/LandingPage/LandingPage';
import LayoutWithNavbar from './Pages/Customer/Layout/LayoutWithNavbar';
import LayoutWithoutNavbar from './Pages/Customer/Layout/LayoutWithoutNavbar';
import ViewMenu from './Pages/Customer/Menu/ViewMenu';
import 'bootstrap/dist/css/bootstrap.min.css';
import Restaurant from './Pages/Customer/Restaurant/Restaurant';
import RestaurantList from './Pages/Customer/Restaurant/RestaurantList';
import KommunicateChat from './Pages/ChatBot/chat';
const router = createBrowserRouter([
  {
    element: <LayoutWithNavbar />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
        element:<KommunicateChat/>
      },
      {
        path: "/restaurantList",
        element: <RestaurantList />,
        element:<KommunicateChat/>
      },
      {
        path: "/restaurantList/:restaurant_id",
        element: <Restaurant />,
        element:<KommunicateChat/>
      },
      {
        path: "/customer/menu/:restaurantId/:reservationId",
        element: <ViewMenu />,
        element:<KommunicateChat/>
      },
    ]
  },
  {
    element: <LayoutWithoutNavbar />,
    children: [
      {
        path: "/user/login",
        element: <Login />,
        element:<KommunicateChat/>
      },
      {
        path:"/user/signup",
        element: <SignUp />
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
