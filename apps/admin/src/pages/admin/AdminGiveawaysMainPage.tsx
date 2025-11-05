import { Link, useLocation } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Gift, Package, Activity, Plus, TrendingUp } from 'lucide-react';

export default function AdminGiveawaysMainPage() {
  const location = useLocation();

  const tabs = [
    { path: '/giveaways/bundles', label: 'Giveaway Templates', icon: Package },
    { path: '/giveaways/active', label: 'Active Giveaways', icon: Activity },
    { path: '/giveaways/tracks', label: 'Giveaway Tracks', icon: TrendingUp },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Gift className="h-8 w-8 text-purple-600" />
              Giveaways Management
            </h1>
            <p className="text-gray-600 mt-1">Create giveaway templates, set up milestone tracks, and monitor active giveaways</p>
          </div>
          <Link
            to="/giveaways/create"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Giveaway
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive(tab.path)
                      ? 'border-purple-600 text-purple-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/giveaways/bundles"
            className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-600 rounded-lg p-3">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Giveaway Templates</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create giveaway templates by selecting products from your Shopify store. Set unlock requirements and reuse rules.
            </p>
            <div className="text-purple-600 font-medium text-sm">
              Manage Templates →
            </div>
          </Link>

          <Link
            to="/giveaways/active"
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-600 rounded-lg p-3">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Active Giveaways</h3>
            <p className="text-gray-600 text-sm mb-4">
              Monitor currently running giveaways, view entries, and select winners when giveaways end.
            </p>
            <div className="text-green-600 font-medium text-sm">
              View Active →
            </div>
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How Giveaways Work</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Templates</h4>
              <p className="text-sm text-gray-600">
                Select products from Shopify to create giveaway templates. Set unlock requirements based on partner sales.
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Partners Launch</h4>
              <p className="text-sm text-gray-600">
                When partners hit sales thresholds, they can launch giveaways using your templates from their portal.
              </p>
            </div>
            <div>
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Monitor & Select Winners</h4>
              <p className="text-sm text-gray-600">
                Track active giveaways, view entries, and select winners. System auto-creates Shopify orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
