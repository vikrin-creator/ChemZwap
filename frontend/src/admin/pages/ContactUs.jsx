import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../services/api';
import BottomNav from '../components/BottomNav';
import { MessageSquare, RefreshCw, Trash2, Mail, Phone, User } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const ContactUs = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Expanded Message State
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.enquiries.getAll();
            // Filter only contact form submissions (product_name starts with "Contact Form")
            const allEnquiries = response.data?.data || [];
            const contactFormEnquiries = allEnquiries.filter(e =>
                e.product_name?.toLowerCase().includes('contact form')
            );
            setContacts(contactFormEnquiries);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Failed to load contact submissions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminApi.enquiries.updateStatus(id, newStatus);
            toast.success('Status updated successfully');
            fetchContacts();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    // Open delete modal
    const confirmDelete = (id) => {
        setSelectedContactId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedContactId) return;

        try {
            setIsDeleting(true);
            await adminApi.enquiries.delete(selectedContactId);
            toast.success('Contact deleted successfully');
            fetchContacts();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast.error('Failed to delete contact');
        } finally {
            setIsDeleting(false);
            setSelectedContactId(null);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const statusStyles = {
            new: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            closed: 'bg-green-500/20 text-green-400 border-green-500/50'
        };
        return statusStyles[status] || statusStyles.new;
    };

    const getEnquiryType = (productName) => {
        if (!productName) return 'General';
        return productName.replace('Contact Form - ', '').replace('Contact Form Enquiry', 'General');
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
                        Contact Us
                    </h1>
                    <p className="text-gray-400 mt-1">{contacts.length} contact form submissions</p>
                </div>
                <button
                    onClick={fetchContacts}
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
                    placeholder="Search by name, email or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
            </div>

            {/* Contact Cards */}
            {filteredContacts.length === 0 ? (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">No Contact Submissions</h2>
                    <p className="text-gray-500">
                        {searchQuery ? 'No contacts match your search.' : 'No contact form submissions yet.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                        >
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                        {contact.customer_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{contact.customer_name}</h3>
                                        <span className="text-xs text-gray-400">{formatDate(contact.created_at)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/50">
                                        {getEnquiryType(contact.product_name)}
                                    </span>
                                    <select
                                        value={contact.status}
                                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border bg-transparent cursor-pointer ${getStatusBadge(contact.status)}`}
                                    >
                                        <option value="new" className="bg-gray-900">New</option>
                                        <option value="contacted" className="bg-gray-900">Contacted</option>
                                        <option value="closed" className="bg-gray-900">Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-4 mb-4 text-sm">
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                                    <Mail className="w-4 h-4" />
                                    {contact.email}
                                </a>
                                {contact.mobile && (
                                    <a href={`tel:${contact.mobile}`} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
                                        <Phone className="w-4 h-4" />
                                        {contact.mobile}
                                    </a>
                                )}
                            </div>

                            {/* Message */}
                            {contact.message && (
                                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                        {expandedId === contact.id || contact.message.length <= 150
                                            ? contact.message
                                            : `${contact.message.substring(0, 150)}...`}
                                    </p>
                                    {contact.message.length > 150 && (
                                        <button
                                            onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                                            className="text-cyan-400 text-xs mt-2 hover:underline"
                                        >
                                            {expandedId === contact.id ? 'Show less' : 'Read more'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => confirmDelete(contact.id)}
                                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Contact"
                message="Are you sure you want to delete this contact submission? This action cannot be undone."
                isLoading={isDeleting}
            />

            <BottomNav />
        </div>
    );
};

export default ContactUs;
