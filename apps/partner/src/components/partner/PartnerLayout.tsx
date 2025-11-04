import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Gift, Users, Trophy, Package, Settings, LogOut, Bell, DollarSign } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);

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

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/giveaways', icon: Gift, label: 'Giveaways' },
    { path: '/rewards', icon: Trophy, label: 'Rewards' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {nonprofit?.logo_url ? (
                <img src={nonprofit.logo_url} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  {nonprofit?.organization_name?.[0] || 'P'}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900">{nonprofit?.organization_name}</h1>
                <p className="text-xs text-gray-500">Partner Center</p>
              </div>
            </div>

            {/* Balance & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Balance</p>
                  <p className="text-sm font-bold text-gray-900">
                    ${nonprofit?.mumbies_cash_balance?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="h-5 w-5" />
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 -mb-px mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
