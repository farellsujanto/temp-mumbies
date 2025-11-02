import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'customer' | 'partner' | 'admin';
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, userProfile, isPartner, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user || !userProfile) {
      // Not logged in → redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (requireRole === 'partner' && !isPartner) {
      // Logged in but not a partner → redirect to partner apply
      navigate('/partner/apply');
      return;
    }

    if (requireRole === 'admin' && !isAdmin) {
      // Logged in but not admin → redirect home
      navigate('/');
      return;
    }
  }, [user, userProfile, isPartner, isAdmin, requireRole, navigate, location, loading]);

  // Show nothing while checking auth or redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || !userProfile) return null;
  if (requireRole === 'partner' && !isPartner) return null;
  if (requireRole === 'admin' && !isAdmin) return null;

  return <>{children}</>;
}
