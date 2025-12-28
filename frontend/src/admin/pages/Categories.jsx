import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../services/api';
import BottomNav from '../components/BottomNav';
import ConfirmationModal from '../components/ConfirmationModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({ name: '' });

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.categories.getAll();
            setCategories(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
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
            submitData.append('name', formData.name);
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (editingCategory) {
                submitData.append('_method', 'PUT');
            }

            const token = localStorage.getItem('adminToken');
            const url = editingCategory
                ? `${API_URL}/api/categories/${editingCategory.id}`
                : `${API_URL}/api/categories`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: submitData
            });

            const data = await response.json();
            if (data.success) {
                toast.success(editingCategory ? 'Category updated!' : 'Category created!');
                setShowModal(false);
                setEditingCategory(null);
                resetForm();
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to save category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name || '' });
        setImageFile(null);
        setImagePreview(category.image ? `${API_URL}${category.image}` : '');
        setShowModal(true);
    };

    const confirmDelete = (id) => {
        setSelectedCategoryId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedCategoryId) return;

        try {
            setIsDeleting(true);
            await adminApi.categories.delete(selectedCategoryId);
            toast.success('Category deleted successfully');
            fetchCategories();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        } finally {
            setIsDeleting(false);
            setSelectedCategoryId(null);
        }
    };

    const resetForm = () => {
        setFormData({ name: '' });
        setImageFile(null);
        setImagePreview('');
    };

    const openAddModal = () => {
        setEditingCategory(null);
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
                        Categories
                    </h1>
                    <p className="text-gray-400 mt-1">{categories.length} categories</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg transition-all hover:bg-green-500"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </button>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">🏷️</div>
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">No Categories</h2>
                    <p className="text-gray-500 mb-4">Get started by adding your first category</p>
                    <button onClick={openAddModal} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg">
                        Add Category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-cyan-500/50 transition-all group"
                        >
                            {/* Category Image */}
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 mb-3 flex items-center justify-center">
                                {category.image ? (
                                    <img
                                        src={`${API_URL}${category.image}`}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-4xl text-gray-600">🏷️</div>
                                )}
                            </div>

                            {/* Category Name */}
                            <h3 className="text-white font-medium text-center truncate mb-3">
                                {category.name}
                            </h3>

                            {/* Actions */}
                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"
                                    title="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => confirmDelete(category.id)}
                                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {editingCategory ? 'Edit Category' : 'Add Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    placeholder="e.g., Lab Equipment"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category Image</label>
                                <div className="space-y-2">
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-600 mx-auto" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                                    />
                                    <p className="text-xs text-gray-500">JPG, PNG, GIF, SVG supported.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingCategory(null); }}
                                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">
                                    {editingCategory ? 'Update' : 'Add'} Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                isLoading={isDeleting}
            />

            <BottomNav />
        </div>
    );
};

export default Categories;
