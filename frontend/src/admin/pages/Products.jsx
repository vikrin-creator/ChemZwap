import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../services/api';
import BottomNav from '../components/BottomNav';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        productName: '',
        synonyms: '',
        casNumber: '',
        einecs: '',
        category: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.products.getAll();
            setProducts(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('productName', formData.productName);
            submitData.append('synonyms', formData.synonyms);
            submitData.append('casNumber', formData.casNumber);
            submitData.append('einecs', formData.einecs);
            submitData.append('category', formData.category);
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            const token = localStorage.getItem('adminToken');
            const url = editingProduct
                ? `${API_URL}/api/products/${editingProduct.id}`
                : `${API_URL}/api/products`;

            const response = await fetch(url, {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: submitData
            });

            const data = await response.json();
            if (data.success) {
                toast.success(editingProduct ? 'Product updated!' : 'Product created!');
                setShowModal(false);
                setEditingProduct(null);
                resetForm();
                fetchProducts();
            } else {
                toast.error(data.message || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            productName: product.product_name || '',
            synonyms: product.synonyms || '',
            casNumber: product.cas_number || '',
            einecs: product.einecs || '',
            category: product.category || ''
        });
        setImageFile(null);
        setImagePreview(product.image ? `${API_URL}${product.image}` : '');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await adminApi.products.delete(id);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const resetForm = () => {
        setFormData({ productName: '', synonyms: '', casNumber: '', einecs: '', category: '' });
        setImageFile(null);
        setImagePreview('');
    };

    const openAddModal = () => {
        setEditingProduct(null);
        resetForm();
        setShowModal(true);
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 bg-black min-h-screen pb-20 md:pb-6 text-white">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-black min-h-screen pb-20 md:pb-6 text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        Products
                    </h1>
                    <p className="text-gray-400 mt-1">{products.length} products</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg transition-all hover:bg-green-500"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            {products.length === 0 ? (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">No Products</h2>
                    <p className="text-gray-500 mb-4">Get started by adding your first product</p>
                    <button onClick={openAddModal} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg">
                        Add Product
                    </button>
                </div>
            ) : (
                <div className="bg-black rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Synonyms</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">CAS Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Einecs</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-900/50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-medium text-white">{product.product_name}</td>
                                        <td className="px-4 py-4 text-sm text-gray-300 max-w-xs truncate">{product.synonyms}</td>
                                        <td className="px-4 py-4 text-sm text-cyan-400 font-mono">{product.cas_number}</td>
                                        <td className="px-4 py-4 text-sm text-gray-300 font-mono">{product.einecs}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300" title="Edit">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300" title="Delete">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {editingProduct ? 'Edit Product' : 'Add Product'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={formData.productName}
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., Acetone (Technical Grade)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Synonyms</label>
                                <input
                                    type="text"
                                    value={formData.synonyms}
                                    onChange={(e) => setFormData({ ...formData, synonyms: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., Propanone, 2-Propanone"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">CAS Number</label>
                                    <input
                                        type="text"
                                        value={formData.casNumber}
                                        onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="e.g., 67-64-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Einecs</label>
                                    <input
                                        type="text"
                                        value={formData.einecs}
                                        onChange={(e) => setFormData({ ...formData, einecs: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        placeholder="e.g., 200-662-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
                                <div className="space-y-2">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-600" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                                    />
                                    <p className="text-xs text-gray-500">Max 5MB. JPG, PNG, GIF supported.</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                >
                                    <option value="">Select category</option>
                                    <option value="organic-chemistry">Organic Chemistry</option>
                                    <option value="inorganic-chemistry">Inorganic Chemistry</option>
                                    <option value="analytical-chemistry">Analytical Chemistry</option>
                                    <option value="biotechnology">Biotechnology</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingProduct(null); }}
                                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">
                                    {editingProduct ? 'Update' : 'Add'} Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default Products;
