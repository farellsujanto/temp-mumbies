import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@mumbies/shared';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'admin' | 'partner';
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, userProfile, loading, isAdmin, isPartner } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole === 'partner' && !isPartner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-green-600 text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Partner Access Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be an approved partner to access this portal.
          </p>
          <a
            href="/apply"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3"
          >
            Apply to Become a Partner
          </a>
          <br />
          <a
            href="https://mumbies.com"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Return to Mumbies.com
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
