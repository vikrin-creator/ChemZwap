import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Products', path: '/products' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        toast.success('Logged out successfully');
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img
                            src="/CHEMZWAP HEADER.png"
                            alt="ChemZwap Logo"
                            className="h-16 w-auto group-hover:scale-110 transition-transform"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`font-medium transition-colors ${location.pathname === '/' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                                }`}
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            className={`font-medium transition-colors ${location.pathname === '/about' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                                }`}
                        >
                            About
                        </Link>

                        <Link
                            to="/products"
                            className={`font-medium transition-colors ${location.pathname === '/products' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
                        >
                            Products
                        </Link>

                        <Link
                            to="/contact"
                            className={`font-medium transition-colors ${location.pathname === '/contact' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                                }`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* CTA / User Menu - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="font-medium text-gray-700 max-w-[120px] truncate">
                                        {user?.full_name || user?.username || 'User'}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-medium text-gray-900 truncate">{user?.full_name || user?.username}</p>
                                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Settings className="h-4 w-4" />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                to="/my-enquiries"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Package className="h-4 w-4" />
                                                <span>My Enquiries</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-5 py-2 text-gray-700 font-medium hover:text-primary-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-200"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive(link.path)
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                {isAuthenticated ? (
                                    <>
                                        <div className="px-4 py-2 mb-2">
                                            <p className="font-medium text-gray-900">{user?.full_name || user?.username}</p>
                                            <p className="text-sm text-gray-500">{user?.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            <Settings className="h-5 w-5" />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to="/my-enquiries"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            <Package className="h-5 w-5" />
                                            <span>My Enquiries</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-center"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full px-4 py-3 mt-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg text-center hover:shadow-lg transition-all"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close user menu */}
            {userMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
