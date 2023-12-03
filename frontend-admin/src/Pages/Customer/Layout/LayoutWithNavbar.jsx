import { Outlet } from "react-router-dom";
import CustomNavbar from "../../../Components/Navbar/CustomNavbar";

function LayoutWithNavbar() {
  return (
    <>
      <CustomNavbar />
      <Outlet />
    </>
  );
}

export default LayoutWithNavbar;
