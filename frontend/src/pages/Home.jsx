import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AnimatedMarqueeHero } from '../components/ui/hero-3';
import { Recycle, Shield, TrendingDown, Users, ArrowRight, CheckCircle, Beaker, FlaskConical, Droplet, TestTube, Atom, Microscope, Wind, Factory, ChevronLeft, ChevronRight } from 'lucide-react';

// Hero images - chemical/sustainability themed
const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop&q=80", // Laboratory
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80", // Lab Equipment
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&auto=format&fit=crop&q=80", // Chemical Flask
    "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80", // Plant/Eco
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80", // Recycling
    "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80", // Lab Tubes
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&auto=format&fit=crop&q=80", // Chemical Equipment
    "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=600&auto=format&fit=crop&q=80", // Lab Research
];

const Home = () => {
    const features = [
        {
            icon: Recycle,
            title: 'Circular Economy',
            description: 'Transform excess chemicals into opportunities, supporting a sustainable circular economy.',
        },
        {
            icon: Shield,
            title: 'Quality Assured',
            description: 'Every chemical is verified for quality, ensuring reliability and safety standards.',
        },
        {
            icon: TrendingDown,
            title: 'Competitive Pricing',
            description: 'Access top-quality materials at competitive prices through our marketplace.',
        },
        {
            icon: Users,
            title: 'Trusted Network',
            description: 'Join a growing community of verified suppliers and conscious buyers.',
        },
    ];

    const categories = [
        { icon: Beaker, name: 'Lab Equipment', color: 'from-cyan-400 to-cyan-500' },
        { icon: FlaskConical, name: 'Solvents', color: 'from-blue-400 to-blue-500' },
        { icon: Droplet, name: 'Reagents', color: 'from-teal-400 to-teal-500' },
        { icon: TestTube, name: 'Test Tubes', color: 'from-green-400 to-green-500' },
        { icon: Atom, name: 'Molecular Compounds', color: 'from-emerald-400 to-emerald-500' },
        { icon: Microscope, name: 'Lab Instruments', color: 'from-sky-400 to-sky-500' },
        { icon: Wind, name: 'Gases', color: 'from-indigo-400 to-indigo-500' },
        { icon: Factory, name: 'Industrial Chemicals', color: 'from-violet-400 to-violet-500' },
        { icon: Shield, name: 'Safety Equipment', color: 'from-purple-400 to-purple-500' },
        { icon: Recycle, name: 'Recycled Materials', color: 'from-pink-400 to-pink-500' },
    ];

    const [scrollPosition, setScrollPosition] = React.useState(0);

    const scrollCategories = (direction) => {
        const container = document.getElementById('categories-scroll');
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <AnimatedMarqueeHero
                tagline="Pioneering Chemical Marketplace"
                title={
                    <>
                        Transforming Excess
                        <br />
                        <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            Into Opportunity
                        </span>
                    </>
                }
                description="Connect suppliers with excess chemicals to buyers seeking top-quality materials. Building a sustainable future, one exchange at a time."
                ctaText="Explore Products"
                ctaLink="/products"
                images={HERO_IMAGES}
            />

            {/* Shop Top Categories Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Outfit']">
                            Shop Top Categories
                        </h2>
                        <p className="text-gray-600">Browse our most popular chemical categories</p>
                    </motion.div>

                    <div className="relative group">
                        {/* Left Arrow */}
                        <button
                            onClick={() => scrollCategories('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-6 w-6 text-gray-700" />
                        </button>

                        {/* Categories Scroll Container */}
                        <div
                            id="categories-scroll"
                            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex-shrink-0 flex flex-col items-center cursor-pointer group/item"
                                >
                                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${category.color} bg-opacity-10 flex items-center justify-center mb-3 group-hover/item:scale-110 transition-transform shadow-md hover:shadow-xl`}>
                                        <div className="w-20 h-20 rounded-full bg-primary-100 bg-opacity-70 flex items-center justify-center">
                                            <category.icon className="h-10 w-10 text-primary-700" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 text-center max-w-[120px] leading-tight">
                                        {category.name}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={() => scrollCategories('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>

                    {/* View All Button */}
                    <div className="text-center mt-8">
                        <Link
                            to="/products"
                            className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                        >
                            <span>View All Categories</span>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>


            {/* Company Overview Section - Two Column Layout */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-primary-50/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center space-x-2 mb-4">
                                <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
                                <span className="text-primary-600 font-semibold uppercase tracking-wide text-sm">Who We Are</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-['Outfit']">
                                About <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">ChemZwap</span>
                            </h2>

                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    ChemZwap is a pioneering digital marketplace purpose-built to connect suppliers with
                                    excess chemicals to buyers seeking top-quality materials at competitive prices. Our
                                    platform ensures a reliable and transparent way for businesses to channel unused
                                    chemicals toward productive purposes—all while upholding the highest standards of quality.
                                </p>

                                <p className="text-lg">
                                    Driven by a passion to modernize the chemical supply chain, our team is dedicated to
                                    making the industry more sustainable, efficient, and environmentally conscious. Every
                                    successful exchange on ChemZwap transforms excess chemicals into an opportunity, giving
                                    excess chemicals a renewed purpose and supporting a circular economy.
                                </p>

                                <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 border-l-4 border-primary-500 p-6 rounded-r-xl my-6">
                                    <p className="text-lg font-semibold text-primary-900">
                                        Be a part of the movement to help us create a greener future by joining ChemZwap,
                                        where every transaction is a step toward a healthier planet.
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/about"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all mt-6"
                            >
                                <span>Learn More About Us</span>
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </motion.div>

                        {/* Right Column - Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Main Image Card */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80"
                                    alt="Chemical laboratory"
                                    className="w-full h-[500px] object-cover"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/20 via-transparent to-transparent"></div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                                        <Recycle className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">100%</div>
                                        <div className="text-sm text-gray-600">Sustainable</div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full opacity-20 blur-2xl"></div>
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-20 blur-3xl"></div>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Outfit']">
                            Why Choose ChemZwap?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Our platform brings together reliability, sustainability, and competitive pricing
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-gradient-to-br from-white to-primary-50/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-primary-100 group hover:scale-105"
                            >
                                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
                            Ready to Make an Impact?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                            Join our marketplace today and be part of the sustainable chemical revolution.
                            Whether you're a supplier or buyer, we're here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Browse Products
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

export default Home;
