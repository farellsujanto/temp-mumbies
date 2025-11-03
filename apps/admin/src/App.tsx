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
                    <Route path="/partners" element={<AdminPartnersPage />} />
                    <Route path="/partners/:id" element={<AdminPartnerDetailPage />} />
                    <Route path="/balance-health" element={<AdminBalanceHealthPage />} />
                    <Route path="/accounts" element={<AdminAccountsPage />} />
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
