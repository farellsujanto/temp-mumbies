import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@mumbies/shared';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  UserPlus,
  Gift,
  Award,
  Image,
  Megaphone,
  Star,
  Settings,
  FileText,
  Shield,
  Home,
  User as UserIcon,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
  FlaskConical,
  Package
} from 'lucide-react';
import DebugPanel from './DebugPanel';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, userProfile, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    {
      section: 'Overview',
      items: [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      section: 'User Management',
      items: [
        { to: '/accounts', icon: UserIcon, label: 'All Accounts' },
        { to: '/partners', icon: Users, label: 'Partners' },
        { to: '/partner-applications', icon: FileText, label: 'Applications' },
      ]
    },
    {
      section: 'Financial',
      items: [
        { to: '/balance-health', icon: Shield, label: 'Balance Health' },
        { to: '/payouts', icon: DollarSign, label: 'Payouts' },
      ]
    },
    {
      section: 'Operations',
      items: [
        { to: '/leads', icon: UserPlus, label: 'Leads' },
        { to: '/giveaways', icon: Gift, label: 'Giveaways' },
        { to: '/rewards', icon: Award, label: 'Rewards' },
      ]
    },
    {
      section: 'Content',
      items: [
        { to: '/content/hero', icon: Image, label: 'Hero Slides' },
        { to: '/content/banners', icon: Megaphone, label: 'Banners' },
        { to: '/content/featured', icon: Star, label: 'Featured Rescue' },
      ]
    },
    {
      section: 'Integrations',
      items: [
        { to: '/shopify', icon: Package, label: 'Shopify' },
      ]
    },
    {
      section: 'System',
      items: [
        { to: '/test-mode', icon: FlaskConical, label: 'Test Mode' },
        { to: '/settings', icon: Settings, label: 'Settings' },
        { to: '/activity', icon: FileText, label: 'Activity Log' },
        { to: '/team', icon: Shield, label: 'Admin Users' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed h-full z-30`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://vldnyagcdfirhmgwqhfy.supabase.co/storage/v1/object/public/Mumbies%20Assets/Mumbies_Logo_FINAL.png"
                alt="Mumbies"
                className="h-8"
              />
              <span className="font-bold text-lg">Admin</span>
            </Link>
          ) : (
            <Shield className="h-6 w-6 text-green-600" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navLinks.map((section) => (
            <div key={section.section}>
              {sidebarOpen && (
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.section}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.to)
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 ${
                sidebarOpen ? '' : 'justify-center'
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium flex-shrink-0">
                {userProfile?.full_name?.[0] || userProfile?.email[0].toUpperCase()}
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{userProfile?.full_name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{userProfile?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </>
              )}
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  {sidebarOpen && 'View Site'}
                </Link>
                <Link
                  to="/account"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  {sidebarOpen && 'My Account'}
                </Link>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  {sidebarOpen && 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            {/* Breadcrumb can go here */}
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              {/* Badge for unread notifications */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full"></span>
            </button>

            {/* View Site Button */}
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-green-600 font-medium"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}
