import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Enquiries from '../pages/Enquiries';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-black">
            {/* Left Sidebar Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto relative">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="enquiries" element={<Enquiries />} />
                </Routes>
            </main>

            {/* Bottom Navigation for Mobile */}
            <BottomNav />
        </div>
    );
};

export default AdminLayout;
