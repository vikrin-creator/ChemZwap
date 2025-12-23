import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Beaker, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryData } from '../../data/categories';

const Navbar = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Products', path: '/products' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

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
                        {/* <span className="text-xl md:text-2xl font-bold font-['Outfit'] bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            ChemZwap
                        </span> */}
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

                        {/* Products with Categories Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setShowCategoriesDropdown(true)}
                            onMouseLeave={() => setShowCategoriesDropdown(false)}
                        >
                            <Link
                                to="/products"
                                className={`font-medium transition-colors flex items-center space-x-1 ${location.pathname === '/products' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
                            >
                                <span>Products</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                            </Link>

                            {/* Dropdown Menu */}
                            {showCategoriesDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-4 z-50">
                                    <div className="px-4 pb-2 border-b border-gray-200">
                                        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Browse Categories</h3>
                                    </div>
                                    <div className="py-2">
                                        {categoryData.map((category) => (
                                            <Link
                                                key={category.id}
                                                to="/products"
                                                className="flex items-center space-x-3 px-4 py-3 hover:bg-primary-50 transition-colors group/item"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-gray-900 group-hover/item:text-primary-600 transition-colors text-sm">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {category.subcategories.length} subcategories
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="px-4 pt-2 border-t border-gray-200">
                                        <Link
                                            to="/products"
                                            className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 py-2"
                                        >
                                            View All Products →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/contact"
                            className={`font-medium transition-colors ${location.pathname === '/contact' ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                                }`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* CTA Button - Desktop */}
                    <div className="hidden md:block">
                        <Link
                            to="/contact"
                            className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all"
                        >
                            Get Started
                        </Link>
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
                            <Link
                                to="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block w-full px-4 py-3 mt-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg text-center hover:shadow-lg transition-all"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
