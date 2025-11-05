import { useState, useEffect } from 'react';
import { supabase } from '@mumbies/shared';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Activity,
  User,
  DollarSign,
  Gift,
  UserPlus,
  UserX,
  FileText,
  Package,
  TrendingUp,
  AlertCircle,
  Filter,
  Search,
  Download
} from 'lucide-react';

interface ActivityLog {
  id: string;
  actor_type: 'admin' | 'partner' | 'system';
  actor_id: string | null;
  actor_name: string;
  action_type: string;
  action_description: string;
  entity_type: string;
  entity_id: string | null;
  metadata: any;
  created_at: string;
}

type FilterType = 'all' | 'partners' | 'financial' | 'giveaways' | 'applications' | 'system';

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('7');

  useEffect(() => {
    loadActivities();
  }, [dateRange]);

  const loadActivities = async () => {
    setLoading(true);

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

    const { data, error } = await supabase
      .from('admin_activity_log')
      .select('*')
      .gte('created_at', daysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(200);

    if (data) {
      setActivities(data);
    } else if (error) {
      console.error('Error loading activities:', error);
    }

    setLoading(false);
  };

  const getFilteredActivities = () => {
    let filtered = activities;

    // Apply type filter
    switch (filter) {
      case 'partners':
        filtered = filtered.filter(a =>
          a.action_type.includes('partner') ||
          a.entity_type === 'partner'
        );
        break;
      case 'financial':
        filtered = filtered.filter(a =>
          a.action_type.includes('transaction') ||
          a.action_type.includes('payout') ||
          a.action_type.includes('balance')
        );
        break;
      case 'giveaways':
        filtered = filtered.filter(a =>
          a.action_type.includes('giveaway') ||
          a.entity_type === 'giveaway'
        );
        break;
      case 'applications':
        filtered = filtered.filter(a =>
          a.action_type.includes('application')
        );
        break;
      case 'system':
        filtered = filtered.filter(a =>
          a.actor_type === 'system'
        );
        break;
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.actor_name.toLowerCase().includes(term) ||
        a.action_description.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const getActivityIcon = (actionType: string) => {
    if (actionType.includes('partner')) return User;
    if (actionType.includes('transaction') || actionType.includes('payout')) return DollarSign;
    if (actionType.includes('giveaway')) return Gift;
    if (actionType.includes('application')) return FileText;
    if (actionType.includes('product')) return Package;
    return Activity;
  };

  const getActivityColor = (actionType: string) => {
    if (actionType.includes('approved') || actionType.includes('activated')) return 'text-green-600 bg-green-50';
    if (actionType.includes('rejected') || actionType.includes('suspended')) return 'text-red-600 bg-red-50';
    if (actionType.includes('pending')) return 'text-yellow-600 bg-yellow-50';
    if (actionType.includes('transaction') || actionType.includes('payout')) return 'text-purple-600 bg-purple-50';
    if (actionType.includes('giveaway')) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const exportActivities = () => {
    const csv = [
      ['Date', 'Actor', 'Action', 'Description', 'Entity Type'].join(','),
      ...getFilteredActivities().map(a => [
        new Date(a.created_at).toLocaleString(),
        a.actor_name,
        a.action_type,
        a.action_description.replace(/,/g, ';'),
        a.entity_type
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredActivities = getFilteredActivities();

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
              <Activity className="h-7 w-7 text-green-600" />
              Activity Log
            </h1>
            <p className="text-gray-600 mt-1">
              Track all system activities and admin actions
            </p>
          </div>
          <button
            onClick={exportActivities}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filter === 'all' ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{activities.length}</div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </button>
          <button
            onClick={() => setFilter('partners')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filter === 'partners' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">
              {activities.filter(a => a.action_type.includes('partner') || a.entity_type === 'partner').length}
            </div>
            <div className="text-sm text-gray-600">Partner Actions</div>
          </button>
          <button
            onClick={() => setFilter('financial')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filter === 'financial' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">
              {activities.filter(a => a.action_type.includes('transaction') || a.action_type.includes('payout')).length}
            </div>
            <div className="text-sm text-gray-600">Financial</div>
          </button>
          <button
            onClick={() => setFilter('giveaways')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filter === 'giveaways' ? 'border-orange-600 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">
              {activities.filter(a => a.action_type.includes('giveaway')).length}
            </div>
            <div className="text-sm text-gray-600">Giveaways</div>
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`p-4 rounded-lg border-2 transition-all ${
              filter === 'system' ? 'border-gray-600 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">
              {activities.filter(a => a.actor_type === 'system').length}
            </div>
            <div className="text-sm text-gray-600">System</div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Activities ({filteredActivities.length})
            </h2>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity) => {
                const Icon = getActivityIcon(activity.action_type);
                const colorClass = getActivityColor(activity.action_type);

                return (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900">{activity.actor_name}</p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                            {activity.actor_type}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{activity.action_description}</p>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                            {JSON.stringify(activity.metadata, null, 2)}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
