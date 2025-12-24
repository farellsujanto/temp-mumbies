'use client';

import { useRouter } from 'next/navigation';
import { Shield, Users, TrendingUp, Settings, LogOut, Database, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/authentication/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mumbies Admin</h1>
                <p className="text-xs text-gray-500">Administrator Portal</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard 🛡️</h2>
          <p className="text-gray-600">Manage your platform and monitor activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Active Partners</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Meals</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-orange-600">0</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Reports</h3>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">User Management</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
                <span className="font-medium text-gray-900">View All Users</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
                <span className="font-medium text-gray-900">Manage Roles</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
                <span className="font-medium text-gray-900">User Analytics</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
            </div>
          </div>

          {/* Partner Management */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Partner Management</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all">
                <span className="font-medium text-gray-900">Active Partners</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all">
                <span className="font-medium text-gray-900">Pending Approvals</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all">
                <span className="font-medium text-gray-900">Partner Analytics</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">System Settings</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                <span className="font-medium text-gray-900">Platform Config</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                <span className="font-medium text-gray-900">Email Templates</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                <span className="font-medium text-gray-900">Security Settings</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
            </div>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reports & Analytics</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all">
                <span className="font-medium text-gray-900">Usage Reports</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all">
                <span className="font-medium text-gray-900">Revenue Analytics</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all">
                <span className="font-medium text-gray-900">Export Data</span>
                <span className="text-sm text-gray-500">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
