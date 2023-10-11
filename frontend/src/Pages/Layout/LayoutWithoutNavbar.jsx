import React from 'react';
import { Outlet } from 'react-router-dom';

function LayoutWithoutNavbar() {
    return (
        <Outlet />
    );
}

export default LayoutWithoutNavbar;