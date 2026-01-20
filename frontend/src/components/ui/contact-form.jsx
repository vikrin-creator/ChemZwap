import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, Phone, MessageSquare, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        enquiry: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Save to database (Admin Panel) - Backend will also send email
            const response = await fetch(`${API_URL}/api/enquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: formData.name,
                    email: formData.email,
                    mobile: formData.phone,
                    product_name: formData.enquiry ? `Contact Form - ${formData.enquiry}` : 'Contact Form Enquiry',
                    message: formData.message,
                    enquiry_type: formData.enquiry,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Backend handles email sending automatically via PHPMailer
                setSubmitStatus('success');
                toast.success('Message sent successfully!');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    enquiry: '',
                    message: '',
                });
            } else {
                setSubmitStatus('error');
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitStatus('error');
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100"
        >
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 font-['Outfit'] mb-2">
                    Get in Touch
                </h2>
                <p className="text-gray-600">
                    Have a question or want to learn more? We'd love to hear from you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>

                {/* Enquiry Type */}
                <div>
                    <label htmlFor="enquiry" className="block text-sm font-medium text-gray-700 mb-2">
                        Enquiry Type *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            id="enquiry"
                            name="enquiry"
                            value={formData.enquiry}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
                        >
                            <option value="">Select an option</option>
                            <option value="general">General Inquiry</option>
                            <option value="supplier">Supplier Partnership</option>
                            <option value="buyer">Buyer Information</option>
                            <option value="support">Technical Support</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            placeholder="Tell us more about your inquiry..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            <span>Send Message</span>
                        </>
                    )}
                </motion.button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                    >
                        ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </motion.div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    >
                        ✕ Something went wrong. Please try again or contact us directly.
                    </motion.div>
                )}
            </form>
        </motion.div>
    );
};

export default ContactForm;
