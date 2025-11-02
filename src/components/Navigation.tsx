import { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User, ChevronDown, Award, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { user, userProfile, isPartner, isAdmin, partnerProfile, signOut } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center">
              <img
                src="https://vldnyagcdfirhmgwqhfy.supabase.co/storage/v1/object/public/Mumbies%20Assets/Mumbies_Logo_FINAL.png"
                alt="Mumbies"
                className="h-10 w-auto"
              />
            </a>

            <div className="hidden md:flex items-center gap-6">
              <a href="/shop" className="text-gray-700 hover:text-green-600 font-medium">
                Shop
              </a>
              <a href="/brands" className="text-gray-700 hover:text-green-600 font-medium">
                Brands
              </a>
              <a href="/impact" className="text-gray-700 hover:text-green-600 font-medium">
                Our Impact
              </a>
              <a href="/rescues" className="text-gray-700 hover:text-green-600 font-medium">
                Partner Rescues
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && userProfile ? (
              <>
                {/* Partner Badge */}
                {isPartner && (
                  <a
                    href="/partner/dashboard"
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Partner</span>
                    {partnerProfile && (
                      <span className="text-xs">${partnerProfile.mumbies_cash_balance.toFixed(2)}</span>
                    )}
                  </a>
                )}

                {/* Admin Badge */}
                {isAdmin && (
                  <a
                    href="/admin"
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </a>
                )}

                {/* Account Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline">{userProfile.full_name || 'Account'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {userProfile.full_name || userProfile.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                      </div>

                      <div className="py-1">
                        <a
                          href="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          My Account
                        </a>
                        <a
                          href="/account/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setAccountDropdownOpen(false)}
                        >
                          My Orders
                        </a>
                      </div>

                      {isPartner && (
                        <>
                          <div className="border-t border-gray-200 my-1"></div>
                          <div className="py-1">
                            <div className="px-4 py-1 text-xs font-semibold text-green-600">PARTNER ACCESS</div>
                            <a
                              href="/partner/dashboard"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setAccountDropdownOpen(false)}
                            >
                              Partner Dashboard
                            </a>
                            {partnerProfile && (
                              <div className="px-4 py-2 text-xs text-gray-500">
                                Balance: ${partnerProfile.mumbies_cash_balance.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-200 my-1"></div>
                          <div className="py-1">
                            <div className="px-4 py-1 text-xs font-semibold text-red-600">ADMIN ACCESS</div>
                            <a
                              href="/admin"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setAccountDropdownOpen(false)}
                            >
                              Admin Dashboard
                            </a>
                          </div>
                        </>
                      )}

                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          signOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Login
              </a>
            )}

            <a href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-green-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </a>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <a href="/shop" className="block text-gray-700 hover:text-green-600 font-medium">
              Shop
            </a>
            <a href="/brands" className="block text-gray-700 hover:text-green-600 font-medium">
              Brands
            </a>
            <a href="/impact" className="block text-gray-700 hover:text-green-600 font-medium">
              Our Impact
            </a>
            <a href="/rescues" className="block text-gray-700 hover:text-green-600 font-medium">
              Partner Rescues
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
