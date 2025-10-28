import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          member_since: string;
          attributed_rescue_id: string | null;
          attribution_locked: boolean;
          total_orders: number;
          total_spent: number;
          total_rescue_donations: number;
          total_general_donations: number;
          total_cashback_earned: number;
          referral_code: string | null;
          referred_by_user_id: string | null;
          nonprofit_referral_access: boolean;
          is_admin: boolean;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      nonprofits: {
        Row: {
          id: string;
          organization_name: string;
          ein: string;
          contact_name: string;
          contact_email: string;
          mission_statement: string | null;
          location_city: string | null;
          location_state: string | null;
          website: string | null;
          social_links: Record<string, string>;
          logo_url: string | null;
          status: string;
          verified: boolean;
          created_at: string;
          approved_at: string | null;
          last_sale_date: string | null;
          total_attributed_customers: number;
          total_sales: number;
          total_commissions_earned: number;
          referral_code: string | null;
          referred_by_user_id: string | null;
          referred_by_nonprofit_id: string | null;
          slug: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          story: string | null;
          mission: string | null;
          logo_url: string | null;
          hero_image_url: string | null;
          headquarters_state: string | null;
          manufacturing_location: string | null;
          website: string | null;
          social_links: Record<string, string>;
          is_mumbies_brand: boolean;
          attributes: string[];
          video_url: string | null;
          created_at: string;
          is_active: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          brand_id: string | null;
          category: string | null;
          image_url: string | null;
          additional_images: string[];
          sku: string | null;
          inventory_status: string;
          tags: string[];
          created_at: string;
          is_active: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status: string;
          subtotal: number;
          cashback_amount: number;
          rescue_donation_amount: number;
          general_donation_amount: number;
          slider_position: number;
          attributed_rescue_id: string | null;
          created_at: string;
        };
      };
    };
  };
};
