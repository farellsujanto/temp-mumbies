'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag as TagIcon, Loader2 } from 'lucide-react';
import DeleteConfirmationModal from '@/src/components/DeleteConfirmationModal';
import AdminInput from '@/src/components/AdminInput';
import AdminButton from '@/src/components/AdminButton';
import { PartnerTag } from '@/generated/prisma/client';

interface PartnerTagWithCount extends PartnerTag {
  _count?: {
    users: number;
  };
}

export default function PartnerTagsPage() {
  const [partnerTags, setPartnerTags] = useState<PartnerTagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<PartnerTag | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; tag: PartnerTag | null; deleting: boolean }>({
    show: false,
    tag: null,
    deleting: false,
  });
  const [formData, setFormData] = useState({
    name: '',
    referralPercentage: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPartnerTags();
  }, []);

  const fetchPartnerTags = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/partner-tags');
      const data = await res.json();
      if (data.success) {
        setPartnerTags(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = '/api/v1/admin/partner-tags';
      const method = editingTag ? 'PATCH' : 'POST';
      const body = editingTag
        ? { id: editingTag.id, ...formData, referralPercentage: parseFloat(formData.referralPercentage) }
        : { ...formData, referralPercentage: parseFloat(formData.referralPercentage) };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        fetchPartnerTags();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save partner tag');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', referralPercentage: '' });
    setEditingTag(null);
  };

  const openEditModal = (tag: PartnerTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      referralPercentage: tag.referralPercentage.toString(),
    });
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.tag) return;

    setDeleteModal(prev => ({ ...prev, deleting: true }));
    try {
      const res = await fetch(`/api/v1/admin/partner-tags?id=${deleteModal.tag.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        fetchPartnerTags();
        setDeleteModal({ show: false, tag: null, deleting: false });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete partner tag');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Tags</h1>
          <p className="text-gray-600">Manage partner commission tiers</p>
        </div>
        <AdminButton
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          icon={Plus}
          variant="primary"
        >
          Add Partner Tag
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referral Earnings (%)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partners
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partnerTags.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    No partner tags yet. Create one to get started.
                  </td>
                </tr>
              ) : (
                partnerTags.map(tag => (
                  <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-900">{tag.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {Number(tag.referralPercentage).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        {tag._count?.users || 0} partners
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tag.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(tag)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, tag, deleting: false })}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTag ? 'Edit Partner Tag' : 'Create Partner Tag'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AdminInput
                label="Tag Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Gold Partner, Silver Partner"
              />

              <div>
                <AdminInput
                  label="Referral Percentage (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.referralPercentage}
                  onChange={(e) => setFormData({ ...formData, referralPercentage: e.target.value })}
                  required
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage partners will earn per referral (0-100%)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <AdminButton
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  variant="secondary"
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  className="flex-1"
                  icon={submitting ? Loader2 : undefined}
                >
                  {editingTag ? 'Update' : 'Create'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, tag: null, deleting: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Partner Tag"
        message="Are you sure you want to delete"
        itemName={deleteModal.tag?.name}
        isDeleting={deleteModal.deleting}
      />
    </div>
  );
}
