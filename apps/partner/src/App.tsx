import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@mumbies/shared';
import ProtectedRoute from './components/ProtectedRoute';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import PartnerLeadsPage from './pages/PartnerLeadsPage';
import PartnerGiveawaysPage from './pages/PartnerGiveawaysPage';
import PartnerRewardsPage from './pages/PartnerRewardsPage';
import PartnerReferralsPage from './pages/PartnerReferralsPage';
import PartnerSettingsPage from './pages/PartnerSettingsPage';
import PartnerApplyPage from './pages/PartnerApplyPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PartnerLoginPage />} />
          <Route path="/apply" element={<PartnerApplyPage />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute requireRole="partner">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<PartnerDashboardPage />} />
                  <Route path="/leads" element={<PartnerLeadsPage />} />
                  <Route path="/giveaways" element={<PartnerGiveawaysPage />} />
                  <Route path="/rewards" element={<PartnerRewardsPage />} />
                  <Route path="/referrals" element={<PartnerReferralsPage />} />
                  <Route path="/settings" element={<PartnerSettingsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
