'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Shield, Package, FolderTree, Tag, Building2, LogOut, ChevronDown, Users, FileText, TrendingUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(true);
  const [isPartnerMenuOpen, setIsPartnerMenuOpen] = useState(true);
  const [isReferralMenuOpen, setIsReferralMenuOpen] = useState(true);

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

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Mumbies</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Users Section */}
        <button
          onClick={() => router.push('/dashboard/admin/users')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive('/dashboard/admin/users')
              ? 'bg-red-50 text-red-600 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Users</span>
        </button>

        {/* Products Menu */}
        <div>
          <button
            onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span className="font-medium">Products</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isProductMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isProductMenuOpen && (
            <div className="ml-4 mt-1 space-y-1">
              <button
                onClick={() => router.push('/dashboard/admin/products')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/products')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="text-sm">Store Products</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/categories')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/categories')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span className="text-sm">Categories</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/tags')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/tags')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span className="text-sm">Tags</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/vendors')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/vendors')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Vendors</span>
              </button>
            </div>
          )}
        </div>

        {/* Partner Menu */}
        <div>
          <button
            onClick={() => setIsPartnerMenuOpen(!isPartnerMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <span className="font-medium">Partners</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isPartnerMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isPartnerMenuOpen && (
            <div className="ml-4 mt-1 space-y-1">
              <button
                onClick={() => router.push('/dashboard/admin/partner-applications')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/partner-applications')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">Applications</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/partner-tags')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/partner-tags')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span className="text-sm">Partner Tags</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/admin/partner-questions')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/partner-questions')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Questions</span>
              </button>
            </div>
          )}
        </div>

        {/* Referrals Menu */}
        <div>
          <button
            onClick={() => setIsReferralMenuOpen(!isReferralMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Referrals</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isReferralMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isReferralMenuOpen && (
            <div className="ml-4 mt-1 space-y-1">
              <button
                onClick={() => router.push('/dashboard/admin/referral-logs')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin/referral-logs')
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">Activity Logs</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
