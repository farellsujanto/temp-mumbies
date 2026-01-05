'use client';

import { Package, FolderTree, Tag, Building2, Users, FileText, TrendingUp, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Manage your store from here.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => router.push('/dashboard/admin/users')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
            <Users className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Users</h3>
          <p className="text-sm text-gray-600">Manage user roles</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/products')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Products</h3>
          <p className="text-sm text-gray-600">Manage store products</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/categories')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <FolderTree className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Categories</h3>
          <p className="text-sm text-gray-600">Organize products</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/tags')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <Tag className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Tags</h3>
          <p className="text-sm text-gray-600">Label and filter</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/vendors')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <Building2 className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Vendors</h3>
          <p className="text-sm text-gray-600">Manage suppliers</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/partner-applications')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Applications</h3>
          <p className="text-sm text-gray-600">Review partner apps</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/partner-tags')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
            <Users className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Partner Tags</h3>
          <p className="text-sm text-gray-600">Commission tiers</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/partner-questions')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Partner Questions</h3>
          <p className="text-sm text-gray-600">Application form</p>
        </button>

        <button
          onClick={() => router.push('/dashboard/admin/referral-logs')}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
            <TrendingUp className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Referral Logs</h3>
          <p className="text-sm text-gray-600">Track activity</p>
        </button>
      </div>
    </div>
  );
}
