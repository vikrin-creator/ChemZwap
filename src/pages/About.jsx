import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Leaf, Globe, Award } from 'lucide-react';

const About = () => {
    const values = [
        {
            icon: Leaf,
            title: 'Sustainability',
            description: 'Committed to reducing waste and promoting environmental stewardship in the chemical industry.',
        },
        {
            icon: Globe,
            title: 'Global Impact',
            description: 'Building a worldwide network that transforms local excess into global opportunities.',
        },
        {
            icon: Award,
            title: 'Quality First',
            description: 'Maintaining the highest standards of quality and safety in every transaction.',
        },
        {
            icon: Heart,
            title: 'Community Driven',
            description: 'Fostering a trusted community of suppliers and buyers working toward common goals.',
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-50/30 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-['Outfit']">
                            Our <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Mission & Vision</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Transforming the chemical industry through sustainable marketplace solutions
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl w-fit mb-6">
                                <Target className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Outfit']">
                                Our Mission
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                ChemZwap's mission is to advance sustainability in the chemical industry by
                                seamlessly connecting suppliers of excess chemicals with conscientious buyers.
                                We strive to minimize waste, extend the useful life of resources, and foster a
                                circular economy through secure and high-quality marketplace transactions.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80"
                                alt="Laboratory research"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl order-2 md:order-1"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&auto=format&fit=crop&q=80"
                                alt="Sustainable chemistry"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="order-1 md:order-2"
                        >
                            <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl w-fit mb-6">
                                <Eye className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Outfit']">
                                Our Vision
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                To lead the transformation of the chemical industry toward a zero-waste future by
                                building a global platform where excess materials are continuously repurposed,
                                supporting both economic growth and environmental stewardship.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Outfit']">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do at ChemZwap
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-gradient-to-br from-white to-primary-50/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-primary-100 group hover:scale-105"
                            >
                                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Outfit']">
                            Join Our Journey
                        </h2>
                        <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                            Together, we can build a more sustainable future for the chemical industry.
                            Get in touch to learn how you can be part of this transformation.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Get in Touch
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
