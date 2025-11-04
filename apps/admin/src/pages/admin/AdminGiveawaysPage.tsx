import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Gift,
  Trophy,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Package,
  ExternalLink,
  Clock,
  Plus,
  X,
  Eye
} from 'lucide-react';

interface Giveaway {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  status: string;
  total_entries: number;
  winner_selected_at?: string;
  winner_entry_id?: string;
  partner: {
    organization_name: string;
  };
}

interface GiveawayWinner {
  id: string;
  user_email: string;
  user_name: string;
  selected_at: string;
  shopify_order_id?: string;
  shopify_order_number?: string;
  fulfillment_status: string;
}

export default function AdminGiveawaysPage() {
  const navigate = useNavigate();
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [selectedGiveaway, setSelectedGiveaway] = useState<Giveaway | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [winner, setWinner] = useState<GiveawayWinner | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadGiveaways();
  }, []);

  const loadGiveaways = async () => {
    const { data } = await supabase
      .from('partner_giveaways')
      .select(`
        *,
        partner:nonprofits(organization_name)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setGiveaways(data);
    }
    setLoading(false);
  };

  const loadWinner = async (giveawayId: string) => {
    const { data } = await supabase
      .from('giveaway_winners')
      .select('*')
      .eq('giveaway_id', giveawayId)
      .maybeSingle();

    setWinner(data);
  };

  const selectWinner = async (giveawayId: string) => {
    if (!confirm('Select a random winner for this giveaway?')) return;

    setProcessing(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.rpc('select_giveaway_winner', {
        p_giveaway_id: giveawayId
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: `Winner selected: ${data.winner_name} (${data.winner_email})`
      });

      loadGiveaways();
      loadWinner(giveawayId);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const createShopifyOrder = async (winnerId: string) => {
    if (!confirm('Create Shopify order for this winner?')) return;

    setProcessing(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-shopify-order-for-winner`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ winner_id: winnerId })
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Shopify order created: #${result.shopify_order_number}`
        });
        if (selectedGiveaway) {
          loadWinner(selectedGiveaway);
        }
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading giveaways...</div>
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
              <Gift className="h-7 w-7 text-purple-600" />
              Giveaways Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage partner giveaways and select winners
            </p>
          </div>
          <button
            onClick={() => navigate('/giveaways/create-bundle')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Giveaway Bundle
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Giveaways</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{giveaways.length}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {giveaways.filter(g => g.status === 'active').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {giveaways.reduce((sum, g) => sum + (g.total_entries || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Winners Selected</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {giveaways.filter(g => g.winner_selected_at).length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Giveaways List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">All Giveaways</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Winner
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {giveaways.map((giveaway) => {
                  const hasEnded = new Date(giveaway.ends_at) < new Date();
                  const canSelectWinner = hasEnded && !giveaway.winner_selected_at && giveaway.total_entries > 0;

                  return (
                    <tr
                      key={giveaway.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedGiveaway(giveaway);
                        setShowDetailModal(true);
                        if (giveaway.winner_selected_at) {
                          loadWinner(giveaway.id);
                        }
                      }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{giveaway.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {giveaway.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {giveaway.partner.organization_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(giveaway.starts_at).toLocaleDateString()} - {new Date(giveaway.ends_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {giveaway.total_entries || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(giveaway.status)}`}>
                          {giveaway.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {giveaway.winner_selected_at ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Trophy className="h-4 w-4" />
                            <span className="text-sm font-medium">Selected</span>
                          </div>
                        ) : hasEnded ? (
                          <span className="text-sm text-gray-500">No winner yet</span>
                        ) : (
                          <span className="text-sm text-gray-400">In progress</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGiveaway(giveaway);
                              setShowDetailModal(true);
                              if (giveaway.winner_selected_at) {
                                loadWinner(giveaway.id);
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 inline-flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Giveaway Detail Modal */}
        {showDetailModal && selectedGiveaway && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Gift className="h-6 w-6 text-purple-600" />
                  Giveaway Details
                </h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedGiveaway(null);
                    setWinner(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Title</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedGiveaway.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900 mt-1">{selectedGiveaway.description}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Total Entries</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedGiveaway.total_entries || 0}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Status</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGiveaway.status)}`}>
                      {selectedGiveaway.status}
                    </span>
                  </div>
                </div>

                {/* Partner Info */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Partner Organization</label>
                  <p className="text-lg font-medium text-gray-900 mt-1">{selectedGiveaway.partner.organization_name}</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Starts</label>
                    <p className="text-gray-900 mt-1">{new Date(selectedGiveaway.starts_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ends</label>
                    <p className="text-gray-900 mt-1">{new Date(selectedGiveaway.ends_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Winner Section */}
                {selectedGiveaway.winner_selected_at && winner ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <p className="font-semibold text-yellow-900">Winner Selected</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-yellow-700">Winner Name</label>
                        <p className="font-medium text-yellow-900">{winner.user_name}</p>
                      </div>

                      <div>
                        <label className="text-sm text-yellow-700">Email</label>
                        <p className="font-medium text-yellow-900">{winner.user_email}</p>
                      </div>

                      <div>
                        <label className="text-sm text-yellow-700">Selected</label>
                        <p className="text-sm text-yellow-900">
                          {new Date(winner.selected_at).toLocaleString()}
                        </p>
                      </div>

                      {winner.shopify_order_id && (
                        <div className="pt-3 border-t border-yellow-300">
                          <p className="text-sm text-yellow-700 mb-2">
                            Shopify Order: <span className="font-medium">#{winner.shopify_order_number}</span>
                          </p>
                          <a
                            href={`https://${import.meta.env.VITE_SHOPIFY_STORE}/admin/orders/${winner.shopify_order_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-800 text-sm font-medium"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View in Shopify
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {new Date(selectedGiveaway.ends_at) < new Date() && selectedGiveaway.total_entries > 0 && (
                      <button
                        onClick={() => {
                          selectWinner(selectedGiveaway.id);
                        }}
                        disabled={processing}
                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
                      >
                        <Trophy className="h-5 w-5" />
                        {processing ? 'Selecting Winner...' : 'Select Random Winner'}
                      </button>
                    )}
                  </div>
                )}

                {/* Change Status */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-600 block mb-2">Change Status</label>
                  <select
                    value={selectedGiveaway.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const { error } = await supabase
                        .from('partner_giveaways')
                        .update({ status: newStatus })
                        .eq('id', selectedGiveaway.id);

                      if (!error) {
                        setMessage({ type: 'success', text: `Status updated to ${newStatus}` });
                        loadGiveaways();
                        setSelectedGiveaway({ ...selectedGiveaway, status: newStatus });
                      } else {
                        setMessage({ type: 'error', text: `Failed to update status: ${error.message}` });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
