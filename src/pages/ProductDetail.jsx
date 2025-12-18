import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingCart,
    Download,
    FileText,
    AlertTriangle,
    Info,
    Package,
    Truck,
    Shield
} from 'lucide-react';

// Sample product data - this would come from a database/API
const sampleProduct = {
    productName: 'N,N-Dimethylformamide dimethyl acetal',
    chemicalName: 'DMF-DMA',
    casNumber: '4637-24-5',
    productNumber: 'CZ-140732',
    grade: 'Technical grade, ≥94%',
    molecularFormula: 'C₅H₁₃NO₂',
    molecularWeight: '119.16 g/mol',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&auto=format&fit=crop&q=80',

    pricing: [
        { size: '100ml', price: '₹2,450', stock: 'In Stock' },
        { size: '500ml', price: '₹8,900', stock: 'In Stock' },
        { size: '1L', price: '₹15,600', stock: 'Limited Stock' },
    ],

    properties: {
        appearance: 'Clear, colorless liquid',
        density: '0.920 g/mL at 25 °C',
        boilingPoint: '141-143 °C',
        flashPoint: '34 °C',
        purity: '≥94.0% (GC)',
        solubility: 'Soluble in organic solvents',
    },

    safetyInformation: {
        hazardStatements: ['H226 - Flammable liquid and vapor', 'H302 - Harmful if swallowed'],
        precautionaryStatements: ['P210 - Keep away from heat/sparks/open flames', 'P280 - Wear protective gloves/clothing'],
        signalWord: 'Warning',
    },

    applications: [
        'Pharmaceutical intermediate synthesis',
        'Organic synthesis reagent',
        'Fine chemical production',
        'Research and development',
    ],

    qualityCertifications: ['ISO 9001', 'GMP Compliant', 'Quality Tested'],

    documents: [
        { name: 'Certificate of Analysis (CoA)', type: 'PDF' },
        { name: 'Safety Data Sheet (SDS)', type: 'PDF' },
        { name: 'Product Specification Sheet', type: 'PDF' },
    ],
};

const ProductDetail = () => {
    const [selectedSize, setSelectedSize] = useState(sampleProduct.pricing[0]);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-sm text-gray-600">
                        <span className="hover:text-primary-600 cursor-pointer">Home</span>
                        <span className="mx-2">/</span>
                        <span className="hover:text-primary-600 cursor-pointer">Products</span>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{sampleProduct.productName}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Product Image & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Product Header */}
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Outfit']"
                            >
                                {sampleProduct.productName}
                            </motion.h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                <span><strong>CAS Number:</strong> {sampleProduct.casNumber}</span>
                                <span><strong>Product Number:</strong> {sampleProduct.productNumber}</span>
                                <span><strong>Grade:</strong> {sampleProduct.grade}</span>
                            </div>
                        </div>

                        {/* Product Image */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex justify-center items-center border border-gray-200">
                            <img
                                src={sampleProduct.image}
                                alt={sampleProduct.productName}
                                className="max-w-full h-64 object-contain rounded-lg"
                            />
                        </div>

                        {/* Tabs Section */}
                        <div className="border-t border-gray-200 pt-6">
                            {/* Properties */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Properties</h2>
                                <div className="bg-gradient-to-br from-white to-primary-50/30 rounded-xl border border-primary-100 overflow-hidden">
                                    <table className="w-full">
                                        <tbody>
                                            {Object.entries(sampleProduct.properties).map(([key, value], index) => (
                                                <tr key={key} className={index % 2 === 0 ? 'bg-white/50' : ''}>
                                                    <td className="py-3 px-4 font-semibold text-gray-700 capitalize border-b border-gray-200">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-900 border-b border-gray-200">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Applications */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Applications</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {sampleProduct.applications.map((app, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="text-primary-600 mt-1">✓</span>
                                            <span className="text-gray-700">{app}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Safety Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                                    <span>Safety Information</span>
                                </h2>
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-orange-500 text-white font-bold rounded-full text-sm mb-3">
                                            {sampleProduct.safetyInformation.signalWord}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Hazard Statements:</h3>
                                            <ul className="space-y-1">
                                                {sampleProduct.safetyInformation.hazardStatements.map((hazard, index) => (
                                                    <li key={index} className="text-sm text-gray-700">• {hazard}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Precautionary Statements:</h3>
                                            <ul className="space-y-1">
                                                {sampleProduct.safetyInformation.precautionaryStatements.map((precaution, index) => (
                                                    <li key={index} className="text-sm text-gray-700">• {precaution}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documentation */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Documentation</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {sampleProduct.documents.map((doc, index) => (
                                        <button
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-6 w-6 text-primary-600" />
                                                <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                            </div>
                                            <Download className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing & Purchase */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Pricing Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-br from-white to-primary-50/50 rounded-2xl shadow-xl border border-primary-100 p-6"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Select Size</h3>

                                {/* Size Options */}
                                <div className="space-y-3 mb-6">
                                    {sampleProduct.pricing.map((option) => (
                                        <button
                                            key={option.size}
                                            onClick={() => setSelectedSize(option)}
                                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedSize.size === option.size
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 bg-white hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{option.size}</div>
                                                    <div className={`text-sm ${option.stock === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {option.stock}
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-primary-600">{option.price}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Quantity */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                {/* Purchase Buttons */}
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button className="w-full px-6 py-4 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all">
                                        Request Quote
                                    </button>
                                </div>
                            </motion.div>

                            {/* Quality Certifications */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Shield className="h-5 w-5 text-primary-600" />
                                    <span>Quality Assured</span>
                                </h3>
                                <div className="space-y-2">
                                    {sampleProduct.qualityCertifications.map((cert, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                                            <span className="text-primary-600">✓</span>
                                            <span>{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Truck className="h-6 w-6" />
                                    <h3 className="font-bold text-lg">Fast Delivery</h3>
                                </div>
                                <p className="text-sm text-primary-100">
                                    Standard delivery within 3-5 business days. Express shipping available.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
