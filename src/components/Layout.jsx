import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './ui/navbar';
import Footer from './ui/footer';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
