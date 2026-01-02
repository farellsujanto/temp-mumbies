'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import AdminInput from '@/src/components/AdminInput';
import AdminButton from '@/src/components/AdminButton';
import AdminTextarea from '@/src/components/AdminTextarea';import DeleteConfirmationModal from '@/src/components/DeleteConfirmationModal';
interface Vendor {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
  createdAt: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; vendor: Vendor | null; deleting: boolean }>({ show: false, vendor: null, deleting: false });
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/v1/admin/vendors');
      const data = await res.json();
      if (data.success) {
        setVendors(data.data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const method = editingVendor ? 'PATCH' : 'POST';
      const body = editingVendor 
        ? { ...formData, id: editingVendor.id }
        : formData;

      const res = await fetch('/api/v1/admin/vendors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (data.success) {
        await fetchVendors();
        setShowModal(false);
        setEditingVendor(null);
        setFormData({ name: '', slug: '', description: '' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
      alert('Failed to save vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.vendor) return;
    
    setDeleteModal(prev => ({ ...prev, deleting: true }));
    try {
      const res = await fetch(`/api/v1/admin/vendors?id=${deleteModal.vendor.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        await fetchVendors();
        setDeleteModal({ show: false, vendor: null, deleting: false });
      } else {
        alert(data.message);
        setDeleteModal(prev => ({ ...prev, deleting: false }));
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('Failed to delete vendor');
      setDeleteModal(prev => ({ ...prev, deleting: false }));
    }
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      slug: vendor.slug,
      description: vendor.description || '',
    });
    setShowModal(true);
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors</h1>
          <p className="text-gray-600">Manage product vendors and suppliers</p>
        </div>
        <AdminButton
          onClick={() => {
            setEditingVendor(null);
            setFormData({ name: '', slug: '', description: '' });
            setShowModal(true);
          }}
          icon={Plus}
        >
          Add Vendor
        </AdminButton>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Slug</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Products</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Description</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ) : filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No vendors found
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-900">{vendor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vendor.slug}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {vendor._count.products} products
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {vendor.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, vendor, deleting: false })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingVendor ? 'Edit Vendor' : 'Add Vendor'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingVendor(null);
                  setFormData({ name: '', slug: '', description: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AdminInput
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter vendor name"
                required
              />
              
              <AdminInput
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="vendor-slug"
                required
              />
              
              <AdminTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter vendor description..."
                rows={3}
              />
              
              <div className="flex gap-3 pt-4">
                <AdminButton
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVendor(null);
                    setFormData({ name: '', slug: '', description: '' });
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </AdminButton>
                <AdminButton type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Saving...' : editingVendor ? 'Update' : 'Create'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, vendor: null, deleting: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Vendor"
        message="Are you sure you want to delete"
        itemName={deleteModal.vendor?.name}
        isDeleting={deleteModal.deleting}
      />
    </div>
  );
}
