import { useState } from 'react';
import { User, Package, Heart, CreditCard, MapPin, RefreshCw, LogOut, Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import AccountInfoTab from '../components/account/AccountInfoTab';
import OrdersTab from '../components/account/OrdersTab';
import SubscriptionsTab from '../components/account/SubscriptionsTab';
import ImpactTab from '../components/account/ImpactTab';
import AddressBookTab from '../components/account/AddressBookTab';
import PaymentMethodsTab from '../components/account/PaymentMethodsTab';
import TransactionsTab from '../components/account/TransactionsTab';

type TabType = 'info' | 'orders' | 'subscriptions' | 'impact' | 'addresses' | 'payments' | 'transactions';

export default function AccountPage() {
  const { user, userProfile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const tabs = [
    { id: 'info' as TabType, label: 'Account Info', icon: User },
    { id: 'orders' as TabType, label: 'Orders', icon: Package },
    { id: 'transactions' as TabType, label: 'Transactions', icon: Receipt },
    { id: 'subscriptions' as TabType, label: 'Subscriptions', icon: RefreshCw },
    { id: 'impact' as TabType, label: 'My Impact', icon: Heart },
    { id: 'addresses' as TabType, label: 'Address Book', icon: MapPin },
    { id: 'payments' as TabType, label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          {userProfile?.total_cashback_earned > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-xs text-gray-600 font-medium">Mumbies Cash</p>
              <p className="text-lg font-bold text-blue-600">
                ${userProfile.total_cashback_earned.toFixed(2)}
              </p>
            </div>
          )}
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  data-tab={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'info' && <AccountInfoTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'transactions' && <TransactionsTab />}
          {activeTab === 'subscriptions' && <SubscriptionsTab />}
          {activeTab === 'impact' && <ImpactTab />}
          {activeTab === 'addresses' && <AddressBookTab />}
          {activeTab === 'payments' && <PaymentMethodsTab />}
        </div>
      </div>
    </div>
  );
}
