import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Beaker, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryData } from '../data/categories';

const Products = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState(null);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6">
                            <Beaker className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-['Outfit']">
                            Browse <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Products</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Explore our comprehensive catalog of quality chemicals, reagents, and laboratory supplies
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Bar */}
            <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for chemicals, CAS numbers, or categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            />
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                            <Search className="h-5 w-5" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Categories Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Outfit']">
                            Explore by Category
                        </h2>
                        <p className="text-gray-600">Find the right products for your needs</p>
                    </motion.div>

                    {/* Category Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryData.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                            >
                                {/* Category Card */}
                                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200 hover:border-primary-300">
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-2xl font-bold text-white mb-1 font-['Outfit']">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {category.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-primary-600">
                                                {category.subcategories.length} Subcategories
                                            </span>
                                            <ChevronRight className={`h-5 w-5 text-primary-600 transition-transform ${expandedCategory === category.id ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Subcategories */}
                                {expandedCategory === category.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-200 p-6 shadow-md"
                                    >
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 font-['Outfit']">
                                            Subcategories
                                        </h4>
                                        <div className="space-y-4">
                                            {category.subcategories.map((subcat) => (
                                                <div key={subcat.id} className="border-b border-primary-100 last:border-0 pb-4 last:pb-0">
                                                    <h5 className="font-semibold text-primary-900 mb-2 flex items-center space-x-2">
                                                        <span className="h-2 w-2 bg-primary-500 rounded-full"></span>
                                                        <span>{subcat.name}</span>
                                                    </h5>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4">
                                                        {subcat.childCategories.map((child, idx) => (
                                                            <Link
                                                                key={idx}
                                                                to={`/products/${category.id}/${subcat.id}/${child.toLowerCase().replace(/\s+/g, '-')}`}
                                                                className="text-sm text-gray-700 hover:text-primary-600 transition-colors flex items-start space-x-1"
                                                            >
                                                                <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                                <span>{child}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-4 font-['Outfit']">
                            Can't Find What You Need?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8">
                            Contact our team for custom inquiries or special requests
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/product/140732"
                                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all"
                            >
                                View Sample Product
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-4 bg-primary-800 text-white font-semibold rounded-full border-2 border-white hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Products;
