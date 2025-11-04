import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@mumbies/shared';
import ProtectedRoute from './components/ProtectedRoute';
import PasswordProtection from './components/PasswordProtection';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPartnersPage from './pages/admin/AdminPartnersPage';
import AdminPartnerDetailPage from './pages/admin/AdminPartnerDetailPage';
import AdminBalanceHealthPage from './pages/admin/AdminBalanceHealthPage';
import AdminAccountsPage from './pages/admin/AdminAccountsPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminGiveawaysPage from './pages/admin/AdminGiveawaysPage';
import AdminGiveawayBundlesPage from './pages/admin/AdminGiveawayBundlesPage';
import AdminRewardsPage from './pages/admin/AdminRewardsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminActivityPage from './pages/admin/AdminActivityPage';
import AdminAdminUsersPage from './pages/admin/AdminAdminUsersPage';
import AdminHeroSlidesPage from './pages/admin/content/AdminHeroSlidesPage';
import AdminBannersPage from './pages/admin/content/AdminBannersPage';
import AdminFeaturedRescuePage from './pages/admin/content/AdminFeaturedRescuePage';
import AdminPartnerApplicationsPage from './pages/admin/AdminPartnerApplicationsPage';
import AdminTestModePage from './pages/admin/AdminTestModePage';
import AdminShopifyPage from './pages/admin/AdminShopifyPage';
import AdminCreateGiveawayBundlePage from './pages/admin/AdminCreateGiveawayBundlePage';

function App() {
  return (
    <PasswordProtection>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<AdminLoginPage />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute requireRole="admin">
                  <Routes>
                    <Route path="/" element={<AdminDashboardPage />} />
                    <Route path="/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/partners" element={<AdminPartnersPage />} />
                    <Route path="/partners/:id" element={<AdminPartnerDetailPage />} />
                    <Route path="/partner-applications" element={<AdminPartnerApplicationsPage />} />
                    <Route path="/balance-health" element={<AdminBalanceHealthPage />} />
                    <Route path="/accounts" element={<AdminAccountsPage />} />
                    <Route path="/payouts" element={<AdminPayoutsPage />} />
                    <Route path="/leads" element={<AdminLeadsPage />} />
                    <Route path="/giveaway-bundles" element={<AdminGiveawayBundlesPage />} />
                    <Route path="/giveaways" element={<AdminGiveawaysPage />} />
                    <Route path="/giveaways/create-bundle" element={<AdminCreateGiveawayBundlePage />} />
                    <Route path="/rewards" element={<AdminRewardsPage />} />
                    <Route path="/content/hero" element={<AdminHeroSlidesPage />} />
                    <Route path="/content/banners" element={<AdminBannersPage />} />
                    <Route path="/content/featured" element={<AdminFeaturedRescuePage />} />
                    <Route path="/settings" element={<AdminSettingsPage />} />
                    <Route path="/activity" element={<AdminActivityPage />} />
                    <Route path="/team" element={<AdminAdminUsersPage />} />
                    <Route path="/test-mode" element={<AdminTestModePage />} />
                    <Route path="/shopify" element={<AdminShopifyPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </PasswordProtection>
  );
}

export default App;
