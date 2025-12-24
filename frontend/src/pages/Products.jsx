import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


const Products = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Try static JSON first (for Website Builder), fallback to PHP API
                let response = await fetch('/api/products.json');
                if (!response.ok) {
                    response = await fetch(`${API_URL}/api/products`);
                }
                const data = await response.json();
                if (data.success) {
                    // Map API response to expected format
                    const mappedProducts = data.data.map(p => {
                        // Handle image URL - use placeholder if no image
                        let imageUrl = p.image;

                        // If no image or empty string, use placeholder
                        if (!imageUrl || imageUrl.trim() === '') {
                            imageUrl = 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=600&fit=crop';
                        }
                        // If it's a local path, prepend API_URL
                        else if (imageUrl.startsWith('/uploads')) {
                            imageUrl = `${API_URL}${imageUrl}`;
                        }

                        return {
                            id: p.id.toString(),
                            productName: p.product_name,
                            synonyms: p.synonyms || '',
                            casNumber: p.cas_number || '',
                            einecs: p.einecs || '',
                            image: imageUrl,
                            category: p.category || ''
                        };
                    });
                    setProducts(mappedProducts);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.synonyms?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.casNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.einecs?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen">

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
                                placeholder="Search by product name, CAS number, or synonyms..."
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

            {/* Products Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Outfit']">
                            Our Products
                        </h2>
                        <p className="text-gray-600">Showing {filteredProducts.length} products</p>
                    </motion.div>

                    {/* Product Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group"
                            >
                                {/* Product Card */}
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                                    {/* Image Section */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.productName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=600&fit=crop';
                                            }}
                                        />
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        {/* Product Name */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Outfit'] line-clamp-2">
                                            {product.productName}
                                        </h3>

                                        {/* Product Details */}
                                        <div className="space-y-3 mb-6 flex-1">
                                            {/* Synonyms */}
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Synonyms</span>
                                                <span className="text-sm text-gray-700 line-clamp-2">{product.synonyms}</span>
                                            </div>

                                            {/* CAS Number */}
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CAS Number</span>
                                                <span className="text-sm text-gray-900 font-mono font-medium">{product.casNumber}</span>
                                            </div>

                                            {/* Einecs */}
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Einecs</span>
                                                <span className="text-sm text-gray-900 font-mono font-medium">{product.einecs}</span>
                                            </div>
                                        </div>

                                        {/* Enquire Now Button */}
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white font-semibold py-3.5 px-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg"
                                        >
                                            Enquire Now
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* No Results Message */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <Beaker className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search terms</p>
                        </div>
                    )}
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
                        <Link
                            to="/contact"
                            className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all inline-block"
                        >
                            Contact Us
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Products;

