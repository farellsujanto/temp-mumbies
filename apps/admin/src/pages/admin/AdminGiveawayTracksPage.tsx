import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Edit2, Trash2, Calendar, Rocket, Target, Package, Gift } from 'lucide-react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';

interface GiveawayTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  is_active: boolean;
}

interface GiveawayBundle {
  id: string;
  name: string;
  description: string;
  total_value: number;
  unlock_requirement_value: number;
  track_id: string | null;
  track_milestone_order: number | null;
  track_milestone_label: string | null;
  is_active: boolean;
}

export default function AdminGiveawayTracksPage() {
  const [tracks, setTracks] = useState<GiveawayTrack[]>([]);
  const [bundles, setBundles] = useState<GiveawayBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<GiveawayTrack | null>(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: tracksData } = await supabase
      .from('giveaway_milestone_tracks')
      .select('*')
      .order('display_order', { ascending: true });

    if (tracksData) setTracks(tracksData);

    const { data: bundlesData } = await supabase
      .from('giveaway_bundles')
      .select('*')
      .order('track_milestone_order', { ascending: true });

    if (bundlesData) setBundles(bundlesData);

    setLoading(false);
  };

  const getBundlesByTrack = (trackId: string) => {
    return bundles
      .filter(b => b.track_id === trackId)
      .sort((a, b) => (a.track_milestone_order || 0) - (b.track_milestone_order || 0));
  };

  const getUnassignedBundles = () => {
    return bundles.filter(b => !b.track_id);
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      'trending-up': TrendingUp,
      'calendar': Calendar,
      'rocket': Rocket,
      'target': Target,
      'gift': Gift
    };
    return icons[iconName] || TrendingUp;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
    };
    return colors[color] || colors.green;
  };

  const deleteTrack = async (trackId: string) => {
    if (!confirm('Delete this track? Giveaways in this track will become unassigned.')) return;

    const { error } = await supabase
      .from('giveaway_milestone_tracks')
      .delete()
      .eq('id', trackId);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      loadData();
    }
  };

  const toggleTrackStatus = async (track: GiveawayTrack) => {
    const { error } = await supabase
      .from('giveaway_milestone_tracks')
      .update({ is_active: !track.is_active })
      .eq('id', track.id);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      loadData();
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading tracks...</div>
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
              <TrendingUp className="h-7 w-7 text-green-600" />
              Giveaway Tracks
            </h1>
            <p className="text-gray-600 mt-1">
              Organize giveaways into milestone progression paths
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTrack(null);
              setShowTrackModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Track
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How Giveaway Tracks Work</h3>
          <p className="text-sm text-blue-800">
            Tracks organize giveaways into themed progression paths (e.g., Revenue Milestones, Quarterly Campaigns).
            Partners unlock giveaways sequentially as they meet requirements. This gamifies partner engagement and
            provides clear goals to work toward.
          </p>
        </div>

        {/* Tracks */}
        <div className="space-y-6">
          {tracks.map(track => {
            const Icon = getIconComponent(track.icon);
            const colors = getColorClasses(track.color);
            const trackBundles = getBundlesByTrack(track.id);

            return (
              <div key={track.id} className={`border-2 ${colors.border} rounded-lg overflow-hidden`}>
                {/* Track Header */}
                <div className={`${colors.bg} px-6 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-white rounded-lg ${colors.border} border`}>
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{track.name}</h3>
                        {!track.is_active && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{track.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {trackBundles.length} giveaway{trackBundles.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTrackStatus(track)}
                      className={`px-3 py-1 text-sm rounded-lg font-medium ${
                        track.is_active
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {track.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingTrack(track);
                        setShowTrackModal(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-white rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTrack(track.id)}
                      className="p-2 text-red-600 hover:bg-white rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Track Giveaways */}
                <div className="bg-white p-4">
                  {trackBundles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No giveaways assigned to this track</p>
                      <p className="text-sm mt-1">Edit giveaways to assign them to this track</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {trackBundles.map((bundle, index) => (
                        <div key={bundle.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{bundle.name}</h4>
                              {bundle.track_milestone_label && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                                  {bundle.track_milestone_label}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">
                              Unlock at ${bundle.unlock_requirement_value.toLocaleString()} in sales •
                              ${bundle.total_value.toFixed(2)} value
                            </p>
                          </div>
                          {!bundle.is_active && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unassigned Giveaways */}
        {getUnassignedBundles().length > 0 && (
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Unassigned Giveaways</h3>
              <p className="text-sm text-gray-600 mt-1">
                These giveaways are not part of any track. Edit them to assign to a track.
              </p>
            </div>
            <div className="bg-white p-4 space-y-2">
              {getUnassignedBundles().map(bundle => (
                <div key={bundle.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{bundle.name}</h4>
                    <p className="text-sm text-gray-600">
                      ${bundle.unlock_requirement_value.toLocaleString()} threshold •
                      ${bundle.total_value.toFixed(2)} value
                    </p>
                  </div>
                  {!bundle.is_active && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      Inactive
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Track Modal (simplified - you can expand this) */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingTrack ? 'Edit Track' : 'Create Track'}
            </h3>
            <p className="text-gray-600">Track creation form would go here...</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowTrackModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTrackModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Track
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
