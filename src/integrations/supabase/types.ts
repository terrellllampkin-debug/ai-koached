export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          key: string
          koach_reward: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          key: string
          koach_reward?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          key?: string
          koach_reward?: number
          title?: string
        }
        Relationships: []
      }
      business_intel: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          intel_date: string
          relevance_score: number | null
          source_url: string | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          intel_date?: string
          relevance_score?: number | null
          source_url?: string | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          intel_date?: string
          relevance_score?: number | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      business_listings: {
        Row: {
          business_profile_id: string
          category: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean
          listing_type: string
          price: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_profile_id: string
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          listing_type?: string
          price?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_profile_id?: string
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          listing_type?: string
          price?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_listings_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_name: string
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string
          created_at: string
          description: string | null
          id: string
          industry: string | null
          is_verified: boolean
          logo_url: string | null
          services_offered: string[] | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean
          logo_url?: string | null
          services_offered?: string[] | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean
          logo_url?: string | null
          services_offered?: string[] | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      business_reviews: {
        Row: {
          business_profile_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          reviewer_user_id: string
          updated_at: string
        }
        Insert: {
          business_profile_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          reviewer_user_id: string
          updated_at?: string
        }
        Update: {
          business_profile_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          reviewer_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_reviews_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          agent: string
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          agent: string
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          agent?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_deadlines: {
        Row: {
          category: string
          country: string
          created_at: string
          deadline_date: string
          description: string | null
          id: string
          is_completed: boolean
          reminder_sent: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          country?: string
          created_at?: string
          deadline_date: string
          description?: string | null
          id?: string
          is_completed?: boolean
          reminder_sent?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          country?: string
          created_at?: string
          deadline_date?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          reminder_sent?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_accounts: {
        Row: {
          account_name: string
          account_type: string
          balance: number | null
          created_at: string
          credit_limit: number | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_type: string
          balance?: number | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string
          balance?: number | null
          created_at?: string
          credit_limit?: number | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      entities: {
        Row: {
          created_at: string
          ein: string | null
          entity_type: string
          formed_at: string | null
          id: string
          name: string
          state: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ein?: string | null
          entity_type: string
          formed_at?: string | null
          id?: string
          name: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ein?: string | null
          entity_type?: string
          formed_at?: string | null
          id?: string
          name?: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      koach_balances: {
        Row: {
          balance: number
          created_at: string
          id: string
          lifetime_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          lifetime_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      koach_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          source: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          source?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          milestone_key: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestone_key: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestone_key?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_config: Json | null
          avatar_glb_url: string | null
          avatar_url: string | null
          bio: string | null
          business_type: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          office: Database["public"]["Enums"]["office_level"]
          onboarding_complete: boolean
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_config?: Json | null
          avatar_glb_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_type?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          office?: Database["public"]["Enums"]["office_level"]
          onboarding_complete?: boolean
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_config?: Json | null
          avatar_glb_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_type?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          office?: Database["public"]["Enums"]["office_level"]
          onboarding_complete?: boolean
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          added_at: string
          asset_type: string
          id: string
          symbol: string
          user_id: string
        }
        Insert: {
          added_at?: string
          asset_type: string
          id?: string
          symbol: string
          user_id: string
        }
        Update: {
          added_at?: string
          asset_type?: string
          id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_config: Json | null
          avatar_glb_url: string | null
          avatar_url: string | null
          bio: string | null
          business_type: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          office: Database["public"]["Enums"]["office_level"] | null
          tier: Database["public"]["Enums"]["membership_tier"] | null
          user_id: string | null
        }
        Insert: {
          avatar_config?: Json | null
          avatar_glb_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_type?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          office?: Database["public"]["Enums"]["office_level"] | null
          tier?: Database["public"]["Enums"]["membership_tier"] | null
          user_id?: string | null
        }
        Update: {
          avatar_config?: Json | null
          avatar_glb_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          business_type?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          office?: Database["public"]["Enums"]["office_level"] | null
          tier?: Database["public"]["Enums"]["membership_tier"] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      membership_tier: "free" | "starter" | "builder" | "empire" | "dynasty"
      office_level:
        | "starter_desk"
        | "corner_office"
        | "penthouse"
        | "skyscraper"
        | "empire_tower"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      membership_tier: ["free", "starter", "builder", "empire", "dynasty"],
      office_level: [
        "starter_desk",
        "corner_office",
        "penthouse",
        "skyscraper",
        "empire_tower",
      ],
    },
  },
} as const
