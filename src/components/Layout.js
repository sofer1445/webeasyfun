import React from 'react';
import NavBarComponent from "./pages/NavBarComponent";


const Layout = ({ children }) => (
    <>
        <NavBarComponent />
        <main style={{ paddingTop: '4rem' }}>{children}</main>
    </>
);

export default Layout;