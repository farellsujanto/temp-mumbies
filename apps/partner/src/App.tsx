import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@mumbies/shared';
import ProtectedRoute from './components/ProtectedRoute';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import PartnerApplyPage from './pages/PartnerApplyPage';
import PartnerDiagnosticPage from './pages/PartnerDiagnosticPage';

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
                  <Route path="/" element={<PartnerDashboardPage />} />
                  <Route path="/diagnostic" element={<PartnerDiagnosticPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
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
