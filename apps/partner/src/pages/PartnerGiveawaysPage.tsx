import { useState, useEffect } from 'react';
import { useAuth } from '@mumbies/shared';
import { fetchPartnerGiveaways, formatDate, formatDateTime, getStatusColor, type NormalizedGiveaway } from '../lib/api';

export default function PartnerGiveawaysPage() {
  const { user } = useAuth();
  const [giveaways, setGiveaways] = useState<NormalizedGiveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      loadGiveaways();
    }
  }, [user?.id]);

  async function loadGiveaways() {
    if (!user?.id) return;

    setLoading(true);
    const data = await fetchPartnerGiveaways(user.id);
    setGiveaways(data);
    setLoading(false);
  }

  const filteredGiveaways = statusFilter === 'all' 
    ? giveaways 
    : giveaways.filter(g => g.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Giveaways</h1>
          <p className="text-gray-600 mt-2">Manage your product giveaways and track entries</p>
        </div>
        <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
          Create New Giveaway
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Giveaways</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {filteredGiveaways.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No giveaways found</h3>
          <p className="mt-2 text-gray-600">
            {statusFilter !== 'all' ? 'Try changing your filter' : 'Create your first giveaway to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGiveaways.map((giveaway) => (
            <div key={giveaway.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{giveaway.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(giveaway.status)}`}>
                    {giveaway.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{giveaway.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Date:</span>
                    <span className="text-gray-900 font-medium">{formatDate(giveaway.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">End Date:</span>
                    <span className="text-gray-900 font-medium">{formatDate(giveaway.end_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Entries:</span>
                    <span className="text-gray-900 font-bold text-lg">{giveaway.entries_count}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredGiveaways.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {filteredGiveaways.length} of {giveaways.length} total giveaways
        </div>
      )}
    </div>
  );
}
