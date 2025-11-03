import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface PartnerProfile {
  id: string;
  organization_name: string;
  partner_type: 'nonprofit' | 'organization' | 'affiliate';
  status: string;
  referral_code: string | null;
  mumbies_cash_balance: number;
  logo_url: string | null;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  is_partner: boolean;
  is_admin: boolean;
  nonprofit_id: string | null;
  attributed_rescue_id: string | null;
  attribution_locked: boolean;
  total_orders: number;
  total_spent: number;
  total_rescue_donations: number;
  total_general_donations: number;
  total_cashback_earned: number;
  referral_code: string | null;
  nonprofit_referral_access: boolean;
  member_since: string;
  partner_profile: PartnerProfile | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isPartner: boolean;
  isAdmin: boolean;
  partnerProfile: PartnerProfile | null;
  signInWithEmail: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    console.log('[AuthContext] Fetching user profile for:', userId);

    // First get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !userData) {
      console.error('[AuthContext] Error fetching user:', userError);
      return null;
    }

    console.log('[AuthContext] User data:', userData);

    // If user is a partner, fetch their partner profile
    let partnerProfile = null;
    if (userData.is_partner && userData.nonprofit_id) {
      const { data: nonprofitData, error: nonprofitError } = await supabase
        .from('nonprofits')
        .select('id, organization_name, partner_type, status, referral_code, mumbies_cash_balance, logo_url')
        .eq('id', userData.nonprofit_id)
        .maybeSingle();

      if (nonprofitError) {
        console.error('[AuthContext] Error fetching nonprofit:', nonprofitError);
      } else {
        console.log('[AuthContext] Partner profile:', nonprofitData);
        partnerProfile = nonprofitData;
      }
    }

    const profile = {
      ...userData,
      partner_profile: partnerProfile
    };

    console.log('[AuthContext] Final profile:', profile);
    return profile;
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log('[AuthContext] Initial session check:', !!session?.user);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (mounted) {
          setUserProfile(profile);
          console.log('[AuthContext] Initial profile set:', profile?.is_partner);
        }
      }

      if (mounted) {
        setLoading(false);
        console.log('[AuthContext] Loading complete');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      console.log('[AuthContext] Auth state changed:', _event, !!session?.user);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (mounted) {
          setUserProfile(profile);
          console.log('[AuthContext] Profile updated after auth change:', profile?.is_partner);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string) => {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const isPartnerValue = !!(userProfile?.is_partner && (userProfile?.partner_profile?.status === 'active' || userProfile?.partner_profile?.status === 'approved'));

  console.log('[AuthContext] Auth state:', {
    hasUser: !!user,
    hasUserProfile: !!userProfile,
    isPartner: userProfile?.is_partner,
    partnerProfileStatus: userProfile?.partner_profile?.status,
    isPartnerValue,
    loading
  });

  const value = {
    user,
    userProfile,
    loading,
    isPartner: isPartnerValue,
    isAdmin: !!userProfile?.is_admin,
    partnerProfile: userProfile?.partner_profile || null,
    signInWithEmail,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
