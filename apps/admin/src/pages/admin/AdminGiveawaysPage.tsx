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
  Plus
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
  const [selectedGiveaway, setSelectedGiveaway] = useState<string | null>(null);
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
                    <tr key={giveaway.id} className="hover:bg-gray-50">
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
                          {canSelectWinner && (
                            <button
                              onClick={() => selectWinner(giveaway.id)}
                              disabled={processing}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <Trophy className="h-3 w-3" />
                              Select Winner
                            </button>
                          )}
                          {giveaway.winner_selected_at && (
                            <button
                              onClick={() => {
                                setSelectedGiveaway(giveaway.id);
                                loadWinner(giveaway.id);
                              }}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                            >
                              View Winner
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Winner Modal */}
        {selectedGiveaway && winner && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  Giveaway Winner
                </h3>
                <button
                  onClick={() => {
                    setSelectedGiveaway(null);
                    setWinner(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Winner Name</label>
                  <p className="text-lg font-medium text-gray-900">{winner.user_name}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="text-lg font-medium text-gray-900">{winner.user_email}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Selected</label>
                  <p className="text-sm text-gray-900">
                    {new Date(winner.selected_at).toLocaleString()}
                  </p>
                </div>

                {winner.shopify_order_id ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <p className="font-medium text-green-900">Shopify Order Created</p>
                    </div>
                    <p className="text-sm text-green-800 mb-2">
                      Order #{winner.shopify_order_number}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Status: <span className="font-medium">{winner.fulfillment_status}</span>
                    </p>
                    <a
                      href={`https://${import.meta.env.VITE_SHOPIFY_STORE}/admin/orders/${winner.shopify_order_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View in Shopify
                    </a>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => createShopifyOrder(winner.id)}
                      disabled={processing}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      {processing ? 'Creating Order...' : 'Create Shopify Order'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
