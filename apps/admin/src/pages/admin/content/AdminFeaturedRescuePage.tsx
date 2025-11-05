import { useState, useEffect } from 'react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Star, Search, Check, X, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';

interface Partner {
  id: string;
  organization_name: string;
  logo_url: string | null;
  mission_statement: string | null;
  website_url: string | null;
  city: string | null;
  state: string | null;
  total_sales: number;
  status: string;
}

interface FeaturedRescue {
  id: string;
  partner_id: string;
  title: string;
  description: string;
  image_url: string | null;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  display_location: string[];
  created_at: string;
  partner?: Partner;
}

export default function AdminFeaturedRescuePage() {
  const [featuredRescues, setFeaturedRescues] = useState<FeaturedRescue[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRescue, setEditingRescue] = useState<FeaturedRescue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [{ data: rescuesData }, { data: partnersData }] = await Promise.all([
      supabase
        .from('featured_rescues')
        .select(`
          *,
          partner:nonprofits(*)
        `)
        .order('created_at', { ascending: false }),
      supabase
        .from('nonprofits')
        .select('*')
        .eq('status', 'active')
        .order('organization_name')
    ]);

    if (rescuesData) setFeaturedRescues(rescuesData);
    if (partnersData) setPartners(partnersData);

    setLoading(false);
  };

  const handleCreate = () => {
    setEditingRescue(null);
    setShowCreateModal(true);
  };

  const handleEdit = (rescue: FeaturedRescue) => {
    setEditingRescue(rescue);
    setShowCreateModal(true);
  };

  const toggleActive = async (rescueId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('featured_rescues')
      .update({ is_active: !currentStatus })
      .eq('id', rescueId);

    if (!error) {
      loadData();
    }
  };

  const deleteRescue = async (rescueId: string) => {
    if (!confirm('Delete this featured rescue?')) return;

    const { error } = await supabase
      .from('featured_rescues')
      .delete()
      .eq('id', rescueId);

    if (!error) {
      loadData();
    }
  };

  const activeFeatured = featuredRescues.find(r => r.is_active);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="h-7 w-7 text-yellow-500" />
              Featured Rescue
            </h1>
            <p className="text-gray-600 mt-1">
              Spotlight a partner rescue to drive awareness and support
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Star className="h-4 w-4" />
            Feature a Rescue
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How Featured Rescue Works</h3>
              <p className="text-sm text-blue-800">
                Featured rescues appear on the homepage and partner portal. Use this to:
                highlight a partner's impact, celebrate milestones, or drive donations for specific needs.
                Future widget functionality will let partners embed this on their websites.
              </p>
            </div>
          </div>
        </div>

        {/* Currently Active */}
        {activeFeatured && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
                <h2 className="text-xl font-bold text-gray-900">Currently Featured</h2>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                LIVE
              </span>
            </div>

            <div className="flex gap-6">
              {activeFeatured.image_url && (
                <img
                  src={activeFeatured.image_url}
                  alt={activeFeatured.title}
                  className="w-48 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{activeFeatured.title}</h3>
                <p className="text-gray-700 mb-3">{activeFeatured.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Partner: {activeFeatured.partner?.organization_name}
                  </span>
                  {activeFeatured.partner?.city && activeFeatured.partner?.state && (
                    <span className="text-sm text-gray-500">
                      {activeFeatured.partner.city}, {activeFeatured.partner.state}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(activeFeatured)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(activeFeatured.id, true)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Featured Rescues */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">All Featured Rescues</h2>
          </div>

          {featuredRescues.length === 0 ? (
            <div className="p-12 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No featured rescues yet</p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create First Featured Rescue
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {featuredRescues.map((rescue) => (
                <div key={rescue.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    {rescue.image_url ? (
                      <img
                        src={rescue.image_url}
                        alt={rescue.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{rescue.title}</h3>
                        {rescue.is_active && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rescue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{rescue.partner?.organization_name}</span>
                        {rescue.start_date && (
                          <span>Start: {new Date(rescue.start_date).toLocaleDateString()}</span>
                        )}
                        {rescue.end_date && (
                          <span>End: {new Date(rescue.end_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(rescue)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(rescue.id, rescue.is_active)}
                        className={`px-3 py-1 text-sm rounded ${
                          rescue.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {rescue.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteRescue(rescue.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <FeaturedRescueModal
          rescue={editingRescue}
          partners={partners}
          onClose={() => {
            setShowCreateModal(false);
            setEditingRescue(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingRescue(null);
            loadData();
          }}
        />
      )}
    </AdminLayout>
  );
}

interface FeaturedRescueModalProps {
  rescue: FeaturedRescue | null;
  partners: Partner[];
  onClose: () => void;
  onSave: () => void;
}

function FeaturedRescueModal({ rescue, partners, onClose, onSave }: FeaturedRescueModalProps) {
  const [formData, setFormData] = useState({
    partner_id: rescue?.partner_id || '',
    title: rescue?.title || '',
    description: rescue?.description || '',
    image_url: rescue?.image_url || '',
    cta_text: rescue?.cta_text || 'Learn More',
    cta_link: rescue?.cta_link || '',
    start_date: rescue?.start_date || null,
    end_date: rescue?.end_date || null,
    display_location: rescue?.display_location || ['homepage', 'partner_portal'],
    is_active: rescue?.is_active ?? false
  });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = partners.filter(p =>
    p.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPartner = partners.find(p => p.id === formData.partner_id);

  const handleSave = async () => {
    if (!formData.partner_id || !formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);

    const dataToSave = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    let error;
    if (rescue?.id) {
      ({ error } = await supabase
        .from('featured_rescues')
        .update(dataToSave)
        .eq('id', rescue.id));
    } else {
      ({ error } = await supabase
        .from('featured_rescues')
        .insert([dataToSave]));
    }

    setSaving(false);

    if (!error) {
      onSave();
    } else {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {rescue ? 'Edit Featured Rescue' : 'Create Featured Rescue'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Partner Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Partner *</label>
            {selectedPartner ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                {selectedPartner.logo_url && (
                  <img src={selectedPartner.logo_url} alt="" className="w-12 h-12 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{selectedPartner.organization_name}</p>
                  {selectedPartner.city && selectedPartner.state && (
                    <p className="text-sm text-gray-600">{selectedPartner.city}, {selectedPartner.state}</p>
                  )}
                </div>
                <button
                  onClick={() => setFormData({ ...formData, partner_id: '' })}
                  className="text-red-600 hover:text-red-700"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg">
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search partners..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredPartners.map(partner => (
                    <button
                      key={partner.id}
                      onClick={() => setFormData({ ...formData, partner_id: partner.id })}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                    >
                      {partner.logo_url && (
                        <img src={partner.logo_url} alt="" className="w-10 h-10 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{partner.organization_name}</p>
                        {partner.city && partner.state && (
                          <p className="text-sm text-gray-600">{partner.city}, {partner.state}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Spotlight: Saving Senior Pets"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Tell the story of why this rescue is being featured..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
              <input
                type="text"
                value={formData.cta_link}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
              <input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
              <input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <div>
                <p className="font-medium text-gray-900">Make Active</p>
                <p className="text-sm text-gray-600">Feature will go live immediately</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : (rescue ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
