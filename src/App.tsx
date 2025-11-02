import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import PasswordProtection from './components/PasswordProtection';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import RescuesPage from './pages/RescuesPage';
import RescueProfilePage from './pages/RescueProfilePage';
import BrandsPage from './pages/BrandsPage';
import BrandProfilePage from './pages/BrandProfilePage';
import PartnerApplyPage from './pages/PartnerApplyPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import PartnerProgramPage from './pages/PartnerProgramPage';
import { ImpactPage } from './pages/ImpactPage';
import LeadRegistrationPage from './pages/LeadRegistrationPage';
import GiveawayPage from './pages/GiveawayPage';
import TestPage from './pages/TestPage';
import DiagnosticPage from './pages/DiagnosticPage';
import ShortUrlRedirectPage from './pages/ShortUrlRedirectPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPartnersPage from './pages/admin/AdminPartnersPage';

function App() {
  return (
    <BrowserRouter>
      <PasswordProtection>
        <AuthProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/diagnostic" element={<DiagnosticPage />} />
                <Route path="/lead-registration" element={<LeadRegistrationPage />} />
                <Route path="/s/:code" element={<ShortUrlRedirectPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/rescues" element={<RescuesPage />} />
                <Route path="/rescues/:slug" element={<RescueProfilePage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/brands/:slug" element={<BrandProfilePage />} />
                <Route path="/partners" element={<PartnerProgramPage />} />
                <Route path="/partner/apply" element={<PartnerApplyPage />} />
                <Route path="/partner/login" element={<PartnerLoginPage />} />
                <Route
                  path="/partner/dashboard"
                  element={
                    <ProtectedRoute requireRole="partner">
                      <PartnerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/giveaway/:slug" element={<GiveawayPage />} />
                <Route path="/impact" element={<ImpactPage />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/partners"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <AdminPartnersPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </CartProvider>
        </AuthProvider>
      </PasswordProtection>
    </BrowserRouter>
  );
}

export default App;
