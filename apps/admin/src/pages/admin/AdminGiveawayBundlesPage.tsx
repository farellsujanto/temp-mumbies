import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';
import GiveawayBundleModal from '../../components/admin/GiveawayBundleModal';
import {
  Package,
  Plus,
  Edit2,
  Copy,
  Power,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';

interface GiveawayBundle {
  id: string;
  name: string;
  description: string;
  total_value: number;
  featured_image_url: string | null;
  unlock_requirement_type: string;
  unlock_requirement_value: number;
  is_universal: boolean;
  allow_reuse: boolean;
  cooldown_days: number;
  assigned_partner_ids: string[];
  is_active: boolean;
  products_description: string | null;
  created_at: string;
  updated_at: string;
}

interface PartnerProgress {
  approaching: any[];
  eligible: any[];
  running: any[];
  completed: any[];
}

export default function AdminGiveawayBundlesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bundles' | 'progress'>('bundles');
  const [bundles, setBundles] = useState<GiveawayBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'universal' | 'specific'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState<GiveawayBundle | null>(null);
  const [selectedBundleProgress, setSelectedBundleProgress] = useState<{ bundle: GiveawayBundle; progress: PartnerProgress } | null>(null);

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('giveaway_bundles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setBundles(data);
    if (error) console.error('Error loading giveaways:', error);
    setLoading(false);
  };

  const loadProgressForBundle = async (bundle: GiveawayBundle) => {
    if (!bundle.is_universal) return;

    const threshold = bundle.unlock_requirement_value;

    // Approaching (80-99% of threshold)
    const { data: approaching } = await supabase
      .from('nonprofits')
      .select('id, organization_name, total_sales')
      .gte('total_sales', threshold * 0.8)
      .lt('total_sales', threshold);

    // Get partners who already used this bundle
    const { data: usedPartners } = await supabase
      .from('partner_giveaways')
      .select('partner_id')
      .eq('bundle_id', bundle.id);

    const usedPartnerIds = usedPartners?.map(p => p.partner_id) || [];

    // Eligible (unlocked but haven't used)
    const { data: allEligible } = await supabase
      .from('nonprofits')
      .select('id, organization_name, total_sales')
      .gte('total_sales', threshold);

    const eligible = allEligible?.filter(p => !usedPartnerIds.includes(p.id)) || [];

    // Currently running
    const { data: running } = await supabase
      .from('partner_giveaways')
      .select('*, nonprofit:partner_id(organization_name)')
      .eq('bundle_id', bundle.id)
      .eq('status', 'active');

    // Completed
    const { data: completed } = await supabase
      .from('partner_giveaways')
      .select('*, nonprofit:partner_id(organization_name)')
      .eq('bundle_id', bundle.id)
      .in('status', ['completed', 'ended']);

    setSelectedBundleProgress({
      bundle,
      progress: {
        approaching: approaching || [],
        eligible: eligible || [],
        running: running || [],
        completed: completed || []
      }
    });
  };

  const toggleBundleStatus = async (bundle: GiveawayBundle) => {
    // Check if any partners are currently running this bundle
    if (bundle.is_active) {
      const { data: activeGiveaways } = await supabase
        .from('partner_giveaways')
        .select('id')
        .eq('bundle_id', bundle.id)
        .eq('status', 'active');

      if (activeGiveaways && activeGiveaways.length > 0) {
        alert(`Cannot deactivate: ${activeGiveaways.length} partner(s) currently running this bundle.`);
        return;
      }
    }

    const { error } = await supabase
      .from('giveaway_bundles')
      .update({ is_active: !bundle.is_active })
      .eq('id', bundle.id);

    if (!error) {
      loadBundles();
    }
  };

  const cloneBundle = async (bundle: GiveawayBundle) => {
    const { data, error } = await supabase
      .from('giveaway_bundles')
      .insert({
        name: `Copy of ${bundle.name}`,
        description: bundle.description,
        total_value: bundle.total_value,
        featured_image_url: bundle.featured_image_url,
        unlock_requirement_type: bundle.unlock_requirement_type,
        unlock_requirement_value: bundle.unlock_requirement_value,
        is_universal: bundle.is_universal,
        allow_reuse: bundle.allow_reuse,
        cooldown_days: bundle.cooldown_days,
        assigned_partner_ids: bundle.assigned_partner_ids,
        is_active: false,
        products_description: bundle.products_description
      })
      .select()
      .single();

    if (data) {
      alert('Giveaway cloned successfully!');
      loadBundles();
      setEditingBundle(data);
      setShowModal(true);
    } else if (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const filteredBundles = bundles.filter(bundle => {
    const matchesSearch = bundle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'universal' && bundle.is_universal) ||
      (typeFilter === 'specific' && !bundle.is_universal);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && bundle.is_active) ||
      (statusFilter === 'inactive' && !bundle.is_active);

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTierBadge = (requirementValue: number) => {
    if (requirementValue >= 25000) return { label: 'Platinum', color: 'bg-purple-100 text-purple-700' };
    if (requirementValue >= 10000) return { label: 'Gold', color: 'bg-yellow-100 text-yellow-700' };
    if (requirementValue >= 2500) return { label: 'Silver', color: 'bg-gray-100 text-gray-700' };
    return { label: 'Bronze', color: 'bg-amber-100 text-amber-700' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Giveaways</h1>
              <button
                onClick={() => navigate('/giveaways/active')}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View Active
              </button>
            </div>
            <p className="text-gray-600 mt-1">Manage giveaway templates and partner rewards</p>
          </div>
          <button
            onClick={() => navigate('/giveaways/create')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Giveaway
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bundles')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'bundles'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Giveaways ({bundles.length})
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'progress'
                ? 'border-green-600 text-green-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Partner Progress
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'bundles' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search giveaways..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="universal">Universal</option>
                  <option value="specific">Partner-Specific</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Bundles Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Giveaway Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Tier</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Threshold</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Reusable</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredBundles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No bundles found
                      </td>
                    </tr>
                  ) : (
                    filteredBundles.map((bundle) => {
                      const tier = getTierBadge(bundle.unlock_requirement_value);
                      return (
                        <tr key={bundle.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {bundle.featured_image_url && (
                                <img
                                  src={bundle.featured_image_url}
                                  alt={bundle.name}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{bundle.name}</p>
                                <p className="text-sm text-gray-500">${bundle.total_value.toFixed(2)} value</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              bundle.is_universal
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {bundle.is_universal ? 'Universal' : 'Partner-Specific'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${tier.color}`}>
                              {tier.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            ${bundle.unlock_requirement_value.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            {bundle.allow_reuse ? (
                              <span className="text-sm text-green-700 font-medium">
                                Yes ({bundle.cooldown_days}d cooldown)
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">One-time</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              bundle.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {bundle.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {bundle.is_universal && (
                                <button
                                  onClick={() => loadProgressForBundle(bundle)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="View Progress"
                                >
                                  <TrendingUp className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingBundle(bundle);
                                  setShowModal(true);
                                }}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => cloneBundle(bundle)}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                title="Clone"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toggleBundleStatus(bundle)}
                                className={`p-1 rounded ${
                                  bundle.is_active
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={bundle.is_active ? 'Deactivate' : 'Activate'}
                              >
                                <Power className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 gap-6">
            {bundles.filter(b => b.is_universal && b.is_active).map(bundle => (
              <ProgressCard key={bundle.id} bundle={bundle} onViewDetails={() => loadProgressForBundle(bundle)} />
            ))}
          </div>
        )}

        {/* Bundle Creation/Edit Modal */}
        {showModal && (
          <GiveawayBundleModal
            bundle={editingBundle}
            onClose={() => {
              setShowModal(false);
              setEditingBundle(null);
            }}
            onSave={() => {
              loadBundles();
            }}
          />
        )}

        {/* Progress Detail Modal */}
        {selectedBundleProgress && (
          <ProgressDetailModal
            bundleProgress={selectedBundleProgress}
            onClose={() => setSelectedBundleProgress(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Progress Card Component
function ProgressCard({ bundle, onViewDetails }: { bundle: GiveawayBundle; onViewDetails: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {bundle.featured_image_url && (
            <img src={bundle.featured_image_url} alt={bundle.name} className="w-16 h-16 rounded object-cover" />
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{bundle.name}</h3>
            <p className="text-sm text-gray-600">Unlock at ${bundle.unlock_requirement_value.toLocaleString()}</p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          View Details
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700 font-medium mb-1">Approaching</p>
          <p className="text-2xl font-bold text-orange-900">-</p>
          <p className="text-xs text-orange-600">80-99% threshold</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium mb-1">Eligible</p>
          <p className="text-2xl font-bold text-green-900">-</p>
          <p className="text-xs text-green-600">Ready to activate</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium mb-1">Running</p>
          <p className="text-2xl font-bold text-blue-900">-</p>
          <p className="text-xs text-blue-600">Currently active</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium mb-1">Completed</p>
          <p className="text-2xl font-bold text-gray-900">-</p>
          <p className="text-xs text-gray-600">Finished</p>
        </div>
      </div>
    </div>
  );
}

// Progress Detail Modal Component
function ProgressDetailModal({
  bundleProgress,
  onClose
}: {
  bundleProgress: { bundle: GiveawayBundle; progress: PartnerProgress };
  onClose: () => void;
}) {
  const { bundle, progress } = bundleProgress;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">{bundle.name} - Partner Progress</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Approaching */}
          <div>
            <h4 className="font-semibold text-orange-900 mb-3">Approaching ({progress.approaching.length})</h4>
            {progress.approaching.length > 0 ? (
              <div className="space-y-2">
                {progress.approaching.map((partner: any) => (
                  <div key={partner.id} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded p-3">
                    <span className="font-medium text-gray-900">{partner.organization_name}</span>
                    <span className="text-sm text-orange-700">
                      ${partner.total_sales?.toLocaleString()} / ${bundle.unlock_requirement_value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No partners approaching threshold</p>
            )}
          </div>

          {/* Eligible */}
          <div>
            <h4 className="font-semibold text-green-900 mb-3">Eligible ({progress.eligible.length})</h4>
            {progress.eligible.length > 0 ? (
              <div className="space-y-2">
                {progress.eligible.map((partner: any) => (
                  <div key={partner.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                    <span className="font-medium text-gray-900">{partner.organization_name}</span>
                    <span className="text-sm text-green-700">Ready to activate</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No eligible partners</p>
            )}
          </div>

          {/* Running */}
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">Currently Running ({progress.running.length})</h4>
            {progress.running.length > 0 ? (
              <div className="space-y-2">
                {progress.running.map((giveaway: any) => (
                  <div key={giveaway.id} className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{giveaway.nonprofit?.organization_name}</span>
                      <span className="text-sm text-blue-700">{giveaway.total_entries || 0} entries</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{giveaway.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No active giveaways</p>
            )}
          </div>

          {/* Completed */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Completed ({progress.completed.length})</h4>
            {progress.completed.length > 0 ? (
              <div className="space-y-2">
                {progress.completed.map((giveaway: any) => (
                  <div key={giveaway.id} className="bg-gray-50 border border-gray-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{giveaway.nonprofit?.organization_name}</span>
                      <span className="text-sm text-gray-600">{giveaway.total_entries || 0} entries</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No completed giveaways</p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
