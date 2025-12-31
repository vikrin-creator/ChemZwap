import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Enquiries from '../pages/Enquiries';
import Categories from '../pages/Categories';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-black">
            {/* Left Sidebar Navbar */}
            <Navbar />

            {/* Main Content Area - pl-16 for hamburger menu button space */}
            <main className="flex-1 h-screen overflow-y-auto relative pl-16">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="enquiries" element={<Enquiries />} />
                    <Route path="categories" element={<Categories />} />
                </Routes>
            </main>

            {/* Bottom Navigation for Mobile */}
            <BottomNav />
        </div>
    );
};

export default AdminLayout;
