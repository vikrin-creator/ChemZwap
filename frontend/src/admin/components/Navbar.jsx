import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminApi from "../services/api";
import { LayoutDashboard, Mail, Package, Tag, LogOut, Menu, X, MessageSquare } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch the user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminApi.auth.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUser();
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/enquiries", label: "Enquiries", icon: Mail },
    { path: "/admin/contact-us", label: "Contact Us", icon: MessageSquare },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/categories", label: "Category", icon: Tag },
  ];

  return (
    <>
      {/* Menu Button - Fixed at top left, visible when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay - visible when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - toggleable on both mobile and desktop */}
      <nav className={`
        fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-50 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="p-6">
          {/* Header with Close button on mobile */}
          <div className="flex items-center justify-between mb-10">
            <Link to="/admin" className="flex items-center">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter">
                CHEMZWAP
              </span>
            </Link>
            {/* Close button - visible on both mobile and desktop */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-gray-800">
          {user && (
            <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg bg-gray-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {user.name ? user.name[0].toUpperCase() : "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.name || "Admin"}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

