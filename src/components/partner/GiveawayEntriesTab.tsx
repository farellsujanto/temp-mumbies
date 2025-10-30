import { useState, useEffect } from 'react';
import { Users, Trophy, Mail, Package, CheckCircle, Clock, Truck, MapPin, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface GiveawayEntry {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  zip_code: string;
  winner_selected: boolean;
  winner_notified_at: string | null;
  winner_claimed_at: string | null;
  delivery_status: string;
  delivery_tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping_address: any;
  created_at: string;
}

interface PartnerGiveaway {
  id: string;
  title: string;
  status: string;
  ends_at: string;
  total_entries: number;
  winner_selected_at: string | null;
}

interface GiveawayEntriesTabProps {
  partnerId: string;
}

export default function GiveawayEntriesTab({ partnerId }: GiveawayEntriesTabProps) {
  const [giveaways, setGiveaways] = useState<PartnerGiveaway[]>([]);
  const [selectedGiveaway, setSelectedGiveaway] = useState<string | null>(null);
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [winner, setWinner] = useState<GiveawayEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [updatingDelivery, setUpdatingDelivery] = useState(false);

  useEffect(() => {
    loadGiveaways();
  }, [partnerId]);

  useEffect(() => {
    if (selectedGiveaway) {
      loadEntries();
    }
  }, [selectedGiveaway]);

  async function loadGiveaways() {
    setLoading(true);
    const { data } = await supabase
      .from('partner_giveaways')
      .select('id, title, status, ends_at, total_entries, winner_selected_at')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (data) {
      setGiveaways(data);
      if (data.length > 0 && !selectedGiveaway) {
        setSelectedGiveaway(data[0].id);
      }
    }
    setLoading(false);
  }

  async function loadEntries() {
    const { data } = await supabase
      .from('giveaway_entries')
      .select('*')
      .eq('giveaway_id', selectedGiveaway)
      .order('created_at', { ascending: false });

    if (data) {
      setEntries(data);
      const winnerEntry = data.find((e: GiveawayEntry) => e.winner_selected);
      setWinner(winnerEntry || null);
    }
  }

  async function selectRandomWinner() {
    if (!selectedGiveaway || entries.length === 0) return;

    setSelecting(true);

    const randomIndex = Math.floor(Math.random() * entries.length);
    const winnerEntry = entries[randomIndex];

    const { error: updateEntryError } = await supabase
      .from('giveaway_entries')
      .update({
        winner_selected: true,
        winner_notified_at: new Date().toISOString(),
        delivery_status: 'winner_notified'
      })
      .eq('id', winnerEntry.id);

    if (!updateEntryError) {
      await supabase
        .from('partner_giveaways')
        .update({
          winner_selected_at: new Date().toISOString(),
          winner_entry_id: winnerEntry.id,
          status: 'completed'
        })
        .eq('id', selectedGiveaway);

      alert(`Winner selected: ${winnerEntry.first_name} ${winnerEntry.last_name} (${winnerEntry.email})`);
      loadEntries();
      loadGiveaways();
    }

    setSelecting(false);
  }

  async function updateDeliveryStatus(status: string, trackingNumber?: string) {
    if (!winner) return;

    setUpdatingDelivery(true);

    const updates: any = { delivery_status: status };

    if (status === 'address_confirmed') {
      updates.winner_claimed_at = new Date().toISOString();
    }
    if (status === 'shipped' && trackingNumber) {
      updates.delivery_tracking_number = trackingNumber;
      updates.shipped_at = new Date().toISOString();
    }
    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('giveaway_entries')
      .update(updates)
      .eq('id', winner.id);

    if (!error) {
      loadEntries();
    }

    setUpdatingDelivery(false);
  }

  const getDeliveryProgress = (status: string) => {
    const stages = ['pending', 'winner_notified', 'address_confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = stages.indexOf(status);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getDeliveryStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      winner_notified: 'Winner Notified',
      address_confirmed: 'Address Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading entries...</p>
      </div>
    );
  }

  if (giveaways.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Giveaways Yet</h3>
        <p className="text-gray-600">Create a giveaway to start collecting entries.</p>
      </div>
    );
  }

  const currentGiveaway = giveaways.find(g => g.id === selectedGiveaway);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Select Giveaway</h3>
        <select
          value={selectedGiveaway || ''}
          onChange={(e) => setSelectedGiveaway(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          {giveaways.map((giveaway) => (
            <option key={giveaway.id} value={giveaway.id}>
              {giveaway.title} - {giveaway.total_entries} entries ({giveaway.status})
            </option>
          ))}
        </select>
      </div>

      {currentGiveaway && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Entries</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{entries.length}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-green-600">Winner Status</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {winner ? 'Selected' : 'Not Selected'}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Ends</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {new Date(currentGiveaway.ends_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {!winner && entries.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-600" />
                Select Winner
              </h3>
              <p className="text-gray-600 mb-4">
                Randomly select one winner from {entries.length} entries. The winner will be notified automatically via email.
              </p>
              <Button
                onClick={selectRandomWinner}
                disabled={selecting}
                size="lg"
              >
                {selecting ? 'Selecting...' : 'Select Random Winner'}
              </Button>
            </div>
          )}

          {winner && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-600" />
                Winner Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {winner.first_name} {winner.last_name}</p>
                    <p><strong>Email:</strong> {winner.email}</p>
                    <p><strong>Phone:</strong> {winner.phone || 'Not provided'}</p>
                    <p><strong>ZIP:</strong> {winner.zip_code || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Entered:</strong> {new Date(winner.created_at).toLocaleDateString()}</p>
                    <p><strong>Notified:</strong> {winner.winner_notified_at ? new Date(winner.winner_notified_at).toLocaleDateString() : 'Pending'}</p>
                    {winner.shipped_at && (
                      <p><strong>Shipped:</strong> {new Date(winner.shipped_at).toLocaleDateString()}</p>
                    )}
                    {winner.delivered_at && (
                      <p><strong>Delivered:</strong> {new Date(winner.delivered_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Delivery Status
                </h4>

                <div className="bg-gray-100 rounded-full h-4 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${getDeliveryProgress(winner.delivery_status)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-6 gap-2 mb-6">
                  {['pending', 'winner_notified', 'address_confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                    <div
                      key={status}
                      className={`text-center p-2 rounded-lg text-xs ${
                        winner.delivery_status === status
                          ? 'bg-green-100 border-2 border-green-500 font-bold'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {getDeliveryStatusLabel(status)}
                    </div>
                  ))}
                </div>

                {winner.delivery_tracking_number && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Tracking Number</span>
                    </div>
                    <p className="text-lg font-mono text-blue-700">{winner.delivery_tracking_number}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {winner.delivery_status === 'winner_notified' && (
                    <Button
                      onClick={() => updateDeliveryStatus('address_confirmed')}
                      disabled={updatingDelivery}
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Address Confirmed
                    </Button>
                  )}

                  {winner.delivery_status === 'address_confirmed' && (
                    <Button
                      onClick={() => updateDeliveryStatus('processing')}
                      disabled={updatingDelivery}
                      size="sm"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Start Processing
                    </Button>
                  )}

                  {winner.delivery_status === 'processing' && (
                    <Button
                      onClick={() => {
                        const tracking = prompt('Enter tracking number:');
                        if (tracking) updateDeliveryStatus('shipped', tracking);
                      }}
                      disabled={updatingDelivery}
                      size="sm"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Mark as Shipped
                    </Button>
                  )}

                  {winner.delivery_status === 'shipped' && (
                    <Button
                      onClick={() => updateDeliveryStatus('delivered')}
                      disabled={updatingDelivery}
                      size="sm"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              All Entries ({entries.length} Leads)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold">Email</th>
                    <th className="text-left px-4 py-3 font-semibold">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold">ZIP</th>
                    <th className="text-left px-4 py-3 font-semibold">Entered</th>
                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className={`border-b border-gray-100 ${entry.winner_selected ? 'bg-green-50' : ''}`}>
                      <td className="px-4 py-3">
                        {entry.first_name} {entry.last_name}
                        {entry.winner_selected && (
                          <Trophy className="inline h-4 w-4 text-amber-600 ml-2" />
                        )}
                      </td>
                      <td className="px-4 py-3">{entry.email}</td>
                      <td className="px-4 py-3">{entry.phone || '-'}</td>
                      <td className="px-4 py-3">{entry.zip_code || '-'}</td>
                      <td className="px-4 py-3">{new Date(entry.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {entry.winner_selected ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Winner
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            Entry
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
