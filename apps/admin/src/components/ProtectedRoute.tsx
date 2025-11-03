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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole === 'admin' && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin portal.
          </p>
          <a
            href="https://mumbies.com"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Return to Mumbies.com
          </a>
        </div>
      </div>
    );
  }

  if (requireRole === 'partner' && !isPartner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the partner portal.
          </p>
          <a
            href="https://mumbies.com"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Return to Mumbies.com
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
