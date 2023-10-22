import { Outlet } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';

function LayoutWithNavbar() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default LayoutWithNavbar;