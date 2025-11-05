import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@mumbies/shared';
import { DebugProvider } from './contexts/DebugContext';
import DebugPanel from './components/DebugPanel';
import ProtectedRoute from './components/ProtectedRoute';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import PartnerLeadsPage from './pages/PartnerLeadsPage';
import PartnerGiveawaysPage from './pages/PartnerGiveawaysPage';
import PartnerRewardsPage from './pages/PartnerRewardsPage';
import PartnerProductsPage from './pages/PartnerProductsPage';
import PartnerSettingsPage from './pages/PartnerSettingsPage';
import PartnerApplyPage from './pages/PartnerApplyPage';
import PartnerDiagnosticPage from './pages/PartnerDiagnosticPage';

function App() {
  return (
    <BrowserRouter basename="/partner">
      <AuthProvider>
        <DebugProvider>
          <Routes>
            <Route path="/login" element={<PartnerLoginPage />} />
            <Route path="/apply" element={<PartnerApplyPage />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute requireRole="partner">
                  <Routes>
                    <Route path="/" element={<PartnerDashboardPage />} />
                    <Route path="/dashboard" element={<PartnerDashboardPage />} />
                    <Route path="/leads" element={<PartnerLeadsPage />} />
                    <Route path="/giveaways" element={<PartnerGiveawaysPage />} />
                    <Route path="/rewards" element={<PartnerRewardsPage />} />
                    <Route path="/products" element={<PartnerProductsPage />} />
                    <Route path="/settings" element={<PartnerSettingsPage />} />
                    <Route path="/diagnostic" element={<PartnerDiagnosticPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
          <DebugPanel />
        </DebugProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
