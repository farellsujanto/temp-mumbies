import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Gift,
  Users,
  Trophy,
  Package,
  Settings,
  LogOut,
  Bell,
  DollarSign,
  ChevronDown,
  Menu,
  X,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useAuth, supabase } from '@mumbies/shared';

interface PartnerLayoutProps {
  children: ReactNode;
}

interface NonprofitData {
  id: string;
  organization_name: string;
  logo_url: string | null;
  mumbies_cash_balance: number;
  status: string;
}

export default function PartnerLayout({ children }: PartnerLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [nonprofit, setNonprofit] = useState<NonprofitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadNonprofitData();
  }, [user, navigate]);

  useEffect(() => {
    if (!nonprofit?.id) return;

    const channel = supabase
      .channel('partner-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'nonprofits', filter: `id=eq.${nonprofit.id}` },
        (payload) => {
          if (payload.new) {
            setNonprofit(prev => prev ? { ...prev, ...payload.new as any } : null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nonprofit?.id]);

  const loadNonprofitData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('nonprofits')
        .select('id, organization_name, logo_url, mumbies_cash_balance, status')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data || (data.status !== 'active' && data.status !== 'approved')) {
        navigate('/login');
        return;
      }

      setNonprofit(data);
    } catch (error) {
      console.error('Error loading nonprofit:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    const breadcrumbMap: Record<string, string> = {
      '': 'Dashboard',
      'leads': 'Leads',
      'giveaways': 'Giveaways',
      'rewards': 'Rewards',
      'products': 'Products',
      'settings': 'Settings',
    };

    const breadcrumbs = [{ label: 'Dashboard', path: '/' }];

    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = breadcrumbMap[segment] || segment;
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const navLinks = [
    {
      section: 'Overview',
      items: [
        { path: '/', icon: Home, label: 'Dashboard' },
      ]
    },
    {
      section: 'Marketing',
      items: [
        { path: '/leads', icon: Users, label: 'Leads' },
        { path: '/giveaways', icon: Gift, label: 'Giveaways' },
        { path: '/rewards', icon: Trophy, label: 'Rewards' },
      ]
    },
    {
      section: 'Products',
      items: [
        { path: '/products', icon: Package, label: 'Product Management' },
      ]
    },
    {
      section: 'Account',
      items: [
        { path: '/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
              <span className="font-bold text-lg">Partner</span>
            </Link>
          ) : (
            <Heart className="h-6 w-6 text-green-600" />
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
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.path)
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

        {/* Balance Display */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-gray-200 bg-green-50">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600">Mumbies Cash</p>
                <p className="text-lg font-bold text-green-700">
                  ${nonprofit?.mumbies_cash_balance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 ${
                sidebarOpen ? '' : 'justify-center'
              }`}
            >
              {nonprofit?.logo_url ? (
                <img
                  src={nonprofit.logo_url}
                  alt="Logo"
                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium flex-shrink-0">
                  {nonprofit?.organization_name?.[0] || 'P'}
                </div>
              )}
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{nonprofit?.organization_name}</p>
                    <p className="text-xs text-gray-500">Partner</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </>
              )}
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link
                  to="https://mumbies.us"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  {sidebarOpen && 'View Shop'}
                </Link>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleSignOut();
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
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>

            {/* View Shop Link */}
            <a
              href="https://mumbies.us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:text-green-600 font-medium"
            >
              View Shop
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
