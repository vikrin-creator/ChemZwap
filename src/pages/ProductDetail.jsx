import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { getProductById } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        gstin: '',
        email: '',
        mobile: ''
    });

    // Load product data based on ID
    useEffect(() => {
        const productData = getProductById(id);
        if (productData) {
            setProduct(productData);
        } else {
            // Fallback to a default product if ID not found
            setProduct({
                id: id,
                productName: 'Product Not Found',
                synonyms: 'N/A',
                casNumber: 'N/A',
                einecs: 'N/A',
                image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
            });
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission here
        alert('Enquiry submitted successfully!');
    };

    // Show loading state while product data is being fetched
    if (!product) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-primary-50/20 min-h-screen py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-primary-50/20 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Product Photo Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100"
                >
                    <div className="relative h-[400px] bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </motion.div>

                {/* Product Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 font-['Outfit'] bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                        {product.productName}
                    </h1>

                    <div className="space-y-6">
                        {/* Synonyms */}
                        <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 pb-4">
                            <div className="w-full sm:w-48 font-semibold text-gray-700 mb-2 sm:mb-0">
                                Synonyms
                            </div>
                            <div className="flex-1 text-gray-900">
                                {product.synonyms}
                            </div>
                        </div>

                        {/* CAS Number */}
                        <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 pb-4">
                            <div className="w-full sm:w-48 font-semibold text-gray-700 mb-2 sm:mb-0">
                                CAS Number
                            </div>
                            <div className="flex-1 text-gray-900 font-mono">
                                {product.casNumber}
                            </div>
                        </div>

                        {/* EINECS */}
                        <div className="flex flex-col sm:flex-row sm:items-center pb-2">
                            <div className="w-full sm:w-48 font-semibold text-gray-700 mb-2 sm:mb-0">
                                EINECS
                            </div>
                            <div className="flex-1 text-gray-900 font-mono">
                                {product.einecs}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Outfit']">
                        Product Enquiry
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Fill out the form below and we'll get back to you shortly
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none hover:border-gray-400"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Company Full Name */}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none hover:border-gray-400"
                                placeholder="Enter your company name"
                            />
                        </div>

                        {/* GSTIN */}
                        <div>
                            <label htmlFor="gstin" className="block text-sm font-semibold text-gray-700 mb-2">
                                GSTIN <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="gstin"
                                name="gstin"
                                value={formData.gstin}
                                onChange={handleInputChange}
                                required
                                pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none hover:border-gray-400 font-mono"
                                placeholder="22AAAAA0000A1Z5"
                            />
                            <p className="mt-1 text-xs text-gray-500">Format: 22AAAAA0000A1Z5</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none hover:border-gray-400"
                                placeholder="your.email@company.com"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                required
                                pattern="[0-9]{10}"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none hover:border-gray-400 font-mono"
                                placeholder="9876543210"
                            />
                            <p className="mt-1 text-xs text-gray-500">10-digit mobile number</p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                        >
                            Enquire Now
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
