import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
