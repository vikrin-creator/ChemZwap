import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, token, loading: authLoading } = useAuth();

    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        gstin: '',
        email: '',
        mobile: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Pre-fill form when user is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.full_name || '',
                companyName: user.company_name || '',
                gstin: user.gstin || '',
                email: user.email || '',
                mobile: user.mobile || ''
            });
        }
    }, [user]);

    // Load product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/${id}`);
                const data = await response.json();
                if (data.success && data.data) {
                    // Handle image URL - prepend API_URL if it's a local path
                    let imageUrl = data.data.image || '';
                    // Handle new-style paths (with /api prefix)
                    if (imageUrl && imageUrl.startsWith('/api/uploads')) {
                        imageUrl = `${API_URL}${imageUrl}`;
                    }
                    // Handle old-style paths (without /api prefix)
                    else if (imageUrl && imageUrl.startsWith('/uploads')) {
                        imageUrl = `${API_URL}/api${imageUrl}`;
                    } else if (!imageUrl) {
                        imageUrl = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80';
                    }
                    setProduct({
                        id: data.data.id.toString(),
                        productName: data.data.product_name,
                        synonyms: data.data.synonyms || 'N/A',
                        casNumber: data.data.cas_number || 'N/A',
                        einecs: data.data.einecs || 'N/A',
                        image: imageUrl,
                    });
                } else {
                    // Product not found
                    setProduct({
                        id: id,
                        productName: 'Product Not Found',
                        synonyms: 'N/A',
                        casNumber: 'N/A',
                        einecs: 'N/A',
                        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
                    });
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct({
                    id: id,
                    productName: 'Error Loading Product',
                    synonyms: 'N/A',
                    casNumber: 'N/A',
                    einecs: 'N/A',
                    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
                });
            }
        };
        fetchProduct();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEnquireClick = () => {
        if (!isAuthenticated) {
            // Redirect to login with return URL
            toast('Please login to make an enquiry', { icon: '🔐' });
            navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`);
            return;
        }
        // Scroll to form
        document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Please login to submit an enquiry');
            navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch(`${API_URL}/api/enquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    customer_name: formData.name,
                    company_name: formData.companyName,
                    gstin: formData.gstin,
                    email: formData.email,
                    mobile: formData.mobile,
                    product_id: product?.id,
                    product_name: product?.productName
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                toast.success('Enquiry submitted successfully!');
            } else {
                setSubmitStatus('error');
                toast.error(data.message || 'Failed to submit enquiry');
            }
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            setSubmitStatus('error');
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state while product data is being fetched
    if (!product || authLoading) {
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

                    {/* Quick Enquire Button */}
                    <motion.button
                        onClick={handleEnquireClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-8 w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    >
                        {isAuthenticated ? 'Enquire Now' : 'Login to Enquire'}
                    </motion.button>
                </motion.div>

                {/* Contact Form Card - Only show if authenticated */}
                {isAuthenticated && (
                    <motion.div
                        id="enquiry-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Outfit']">
                            Product Enquiry
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Your details are pre-filled from your profile. Review and submit your enquiry.
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
                                disabled={isSubmitting}
                                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                className={`w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <span>Submit Enquiry</span>
                                )}
                            </motion.button>

                            {/* Success Message */}
                            {submitStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center"
                                >
                                    ✓ Thank you! Your enquiry has been submitted successfully. We'll get back to you soon.
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {submitStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
                                >
                                    ✕ Something went wrong. Please try again or contact us directly.
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                )}

                {/* Login Prompt for non-authenticated users */}
                {!isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center"
                    >
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
                        <p className="text-gray-600 mb-6">
                            Please login or create an account to submit an enquiry for this product. Your profile details will be pre-filled for quick submission.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                onClick={() => navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Login
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(`/register?redirect=${encodeURIComponent(`/product/${id}`)}`)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-3 border-2 border-primary-500 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all"
                            >
                                Create Account
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
