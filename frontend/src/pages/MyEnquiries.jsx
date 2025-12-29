import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MyEnquiries = () => {
    const { token } = useAuth();
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await fetch(`${API_URL}/api/enquiries/mine`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setEnquiries(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching enquiries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchEnquiries();
        }
    }, [token]);

    const getStatusBadge = (status) => {
        const styles = {
            new: 'bg-blue-100 text-blue-700',
            contacted: 'bg-yellow-100 text-yellow-700',
            closed: 'bg-green-100 text-green-700'
        };
        const icons = {
            new: <Clock className="h-4 w-4" />,
            contacted: <Eye className="h-4 w-4" />,
            closed: <CheckCircle className="h-4 w-4" />
        };
        const labels = {
            new: 'New',
            contacted: 'In Progress',
            closed: 'Closed'
        };

        return (
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.new}`}>
                {icons[status] || icons.new}
                <span>{labels[status] || 'New'}</span>
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to="/profile" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Profile
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Outfit']">My Enquiries</h1>
                    <p className="text-gray-600 mt-2">Track all your product enquiries</p>
                </motion.div>

                {/* Enquiries List */}
                {enquiries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100"
                    >
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No enquiries yet</h3>
                        <p className="text-gray-500 mb-6">Start exploring our products and make your first enquiry!</p>
                        <Link
                            to="/products"
                            className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                        >
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {enquiries.map((enquiry, index) => (
                            <motion.div
                                key={enquiry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => setSelectedEnquiry(selectedEnquiry === enquiry.id ? null : enquiry.id)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {enquiry.product_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Enquiry #{enquiry.id} • {formatDate(enquiry.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(enquiry.status)}
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <svg
                                                    className={`h-5 w-5 transform transition-transform ${selectedEnquiry === enquiry.id ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {selectedEnquiry === enquiry.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="border-t border-gray-100 p-6 bg-gray-50"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-semibold text-gray-600">Customer Name:</span>
                                                <p className="text-gray-900">{enquiry.customer_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Company:</span>
                                                <p className="text-gray-900">{enquiry.company_name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Email:</span>
                                                <p className="text-gray-900">{enquiry.email}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Mobile:</span>
                                                <p className="text-gray-900">{enquiry.mobile}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">GSTIN:</span>
                                                <p className="text-gray-900 font-mono">{enquiry.gstin || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Product ID:</span>
                                                <p className="text-gray-900">#{enquiry.product_id || 'N/A'}</p>
                                            </div>
                                            {enquiry.message && (
                                                <div className="md:col-span-2">
                                                    <span className="font-semibold text-gray-600">Message:</span>
                                                    <p className="text-gray-900">{enquiry.message}</p>
                                                </div>
                                            )}
                                        </div>

                                        {enquiry.product_id && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Link
                                                    to={`/product/${enquiry.product_id}`}
                                                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                                                >
                                                    View Product Details →
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEnquiries;
