'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import AdminInput from '@/src/components/AdminInput';
import AdminButton from '@/src/components/AdminButton';
import AdminTextarea from '@/src/components/AdminTextarea';
import DeleteConfirmationModal from '@/src/components/DeleteConfirmationModal';

interface TagItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; tag: TagItem | null; deleting: boolean }>({ show: false, tag: null, deleting: false });
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/v1/admin/tags');
      const data = await res.json();
      if (data.success) setTags(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTag ? 'PATCH' : 'POST';
      const body = editingTag ? { ...formData, id: editingTag.id } : formData;

      const res = await fetch('/api/v1/admin/tags', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        await fetchTags();
        setShowModal(false);
        setEditingTag(null);
        setFormData({ name: '', slug: '', description: '' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.tag) return;
    
    setDeleteModal(prev => ({ ...prev, deleting: true }));
    try {
      const res = await fetch(`/api/v1/admin/tags?id=${deleteModal.tag.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchTags();
        setDeleteModal({ show: false, tag: null, deleting: false });
      } else {
        alert(data.message);
        setDeleteModal(prev => ({ ...prev, deleting: false }));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete tag');
      setDeleteModal(prev => ({ ...prev, deleting: false }));
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
          <p className="text-gray-600">Label and filter your products</p>
        </div>
        <AdminButton
          onClick={() => {
            setEditingTag(null);
            setFormData({ name: '', slug: '', description: '' });
            setShowModal(true);
          }}
          icon={Plus}
        >
          Add Tag
        </AdminButton>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none placeholder:text-gray-600"
          />
        </div>
      </div>

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
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : filteredTags.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No tags found</td></tr>
            ) : (
              filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Tag className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">{tag.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tag.slug}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {tag._count.products}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {tag.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingTag(tag);
                          setFormData({
                            name: tag.name,
                            slug: tag.slug,
                            description: tag.description || '',
                          });
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, tag, deleting: false })}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingTag ? 'Edit Tag' : 'Add Tag'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTag(null);
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
                placeholder="Enter tag name"
                required
              />
              
              <AdminInput
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="tag-slug"
                required
              />
              
              <AdminTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter tag description..."
                rows={3}
              />
              
              <div className="flex gap-3 pt-4">
                <AdminButton
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTag(null);
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </AdminButton>
                <AdminButton type="submit" className="flex-1">
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
        title="Delete Tag"
        message="Are you sure you want to delete"
        itemName={deleteModal.tag?.name}
        isDeleting={deleteModal.deleting}
      />
    </div>
  );
}
