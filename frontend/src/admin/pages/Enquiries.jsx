import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../services/api';
import BottomNav from '../components/BottomNav';
import { Inbox, RefreshCw, Trash2 } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.enquiries.getAll();
            setEnquiries(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            toast.error('Failed to load enquiries');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminApi.enquiries.updateStatus(id, newStatus);
            toast.success('Status updated successfully');
            fetchEnquiries();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    // Open delete modal
    const confirmDelete = (id) => {
        setSelectedEnquiryId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedEnquiryId) return;

        try {
            setIsDeleting(true);
            await adminApi.enquiries.delete(selectedEnquiryId);
            toast.success('Enquiry deleted successfully');
            fetchEnquiries();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            toast.error('Failed to delete enquiry');
        } finally {
            setIsDeleting(false);
            setSelectedEnquiryId(null);
        }
    };

    const filteredEnquiries = enquiries.filter(enquiry =>
        enquiry.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const statusStyles = {
            new: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            closed: 'bg-green-500/20 text-green-400 border-green-500/50'
        };
        return statusStyles[status] || statusStyles.new;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                        Enquiries
                    </h1>
                    <p className="text-gray-400 mt-1">{enquiries.length} total enquiries</p>
                </div>
                <button
                    onClick={fetchEnquiries}
                    className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg transition-all hover:bg-cyan-500"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, company, email or product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
            </div>

            {/* Enquiries Table */}
            {filteredEnquiries.length === 0 ? (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                    <Inbox className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">No Enquiries Found</h2>
                    <p className="text-gray-500">
                        {searchQuery ? 'No enquiries match your search.' : 'No enquiries have been submitted yet.'}
                    </p>
                </div>
            ) : (
                <div className="bg-black rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredEnquiries.map((enquiry) => (
                                    <tr key={enquiry.id} className="hover:bg-gray-900/50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{enquiry.customer_name}</div>
                                            <div className="text-xs text-gray-400">{enquiry.gstin}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {enquiry.company_name}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-gray-300">{enquiry.email}</div>
                                            <div className="text-xs text-gray-400">{enquiry.mobile}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-cyan-400">
                                            {enquiry.product_name || '-'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <select
                                                value={enquiry.status}
                                                onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border bg-transparent cursor-pointer ${getStatusBadge(enquiry.status)}`}
                                            >
                                                <option value="new" className="bg-gray-900">New</option>
                                                <option value="contacted" className="bg-gray-900">Contacted</option>
                                                <option value="closed" className="bg-gray-900">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {formatDate(enquiry.created_at)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => confirmDelete(enquiry.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Enquiry"
                message="Are you sure you want to delete this enquiry? This action cannot be undone."
                isLoading={isDeleting}
            />

            <BottomNav />
        </div>
    );
};

export default Enquiries;
