import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Products', path: '/products' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <img
                                src="/CHEMZWAP HEADER.png"
                                alt="ChemZwap Logo"
                                className="h-20 w-auto"
                            />
                        </div>
                        <p className="text-sm leading-relaxed">
                            A pioneering digital marketplace connecting suppliers with excess chemicals to buyers seeking top-quality materials at competitive prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm hover:text-primary-400 transition-colors inline-block hover:translate-x-1 transition-transform"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <Mail className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="mailto:info@chemzwap.com"
                                    className="text-sm hover:text-primary-400 transition-colors"
                                >
                                    info@chemzwap.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Mission Statement */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Our Mission</h3>
                        <p className="text-sm leading-relaxed">
                            Advancing sustainability in the chemical industry by building a circular economy through secure marketplace transactions.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-400">
                            © {currentYear} ChemZwap. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-400">
                            Designed and Developed by{' '}
                            <a
                                href="https://www.vikrin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                            >
                                Vikrin
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
