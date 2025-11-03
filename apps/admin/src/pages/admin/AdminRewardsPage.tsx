import AdminLayout from '../../components/admin/AdminLayout';
import { Award, Clock } from 'lucide-react';

export default function AdminRewardsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rewards Management</h1>
          <p className="text-gray-600 mt-1">Manage rewards and related operations</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Rewards System</h2>
          <p className="text-gray-600 mb-4">
            This page will allow you to manage rewards and related features.
          </p>
          <div className="inline-flex items-center gap-2 text-blue-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
