import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ui/contact-form';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-['Outfit']">
                            Contact <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Us</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            We're here to help. Reach out with any questions or inquiries.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-['Outfit']">
                                    Let's Connect
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    Whether you're a supplier looking to list excess chemicals or a buyer seeking quality materials,
                                    we're ready to assist you. Fill out the form or reach us directly using the information below.
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                                        <Mail className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                                        <a
                                            href="mailto:info@chemzwap.com"
                                            className="text-primary-600 hover:text-primary-700 transition-colors"
                                        >
                                            info@chemzwap.com
                                        </a>
                                    </div>
                                </div>

                                {/* Office Hours */}
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Office Hours</h3>
                                        <p className="text-gray-600">
                                            Monday - Friday: 9:00 AM - 6:00 PM
                                            <br />
                                            Saturday: 10:00 AM - 4:00 PM
                                        </p>
                                    </div>
                                </div>

                                {/* Response Time */}
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Response Time</h3>
                                        <p className="text-gray-600">
                                            We typically respond within 24 hours during business days.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-6 border border-primary-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Tips</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                                        <span>For product inquiries, please include CAS numbers when available</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                                        <span>Suppliers: Include quantity and storage conditions in your message</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                                        <span>Buyers: Specify your requirements and delivery location</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3"
                        >
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map or Additional CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Outfit']">
                            Join the ChemZwap Community
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Be part of the movement towards a more sustainable chemical industry.
                            Every connection made on our platform is a step toward reducing waste and promoting a circular economy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/products"
                                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Browse Products
                            </a>
                            <a
                                href="/about"
                                className="px-8 py-4 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-full hover:bg-primary-50 hover:scale-105 transition-all"
                            >
                                Learn More
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
