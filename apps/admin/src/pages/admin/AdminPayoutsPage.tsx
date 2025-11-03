import AdminLayout from '../../components/admin/AdminLayout';
import { DollarSign, Clock } from 'lucide-react';

export default function AdminPayoutsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payouts Management</h1>
          <p className="text-gray-600 mt-1">Manage partner payouts and payment history</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <DollarSign className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payouts System</h2>
          <p className="text-gray-600 mb-4">
            This page will allow you to process partner payouts, view payment history, and manage payment methods.
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
