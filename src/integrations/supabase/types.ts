export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          category: Database["public"]["Enums"]["announcement_category"] | null
          content: string
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["announcement_category"] | null
          content: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["announcement_category"] | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_type: string | null
          file_url: string
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          event_date: string
          event_type: string | null
          id: string
          is_public: boolean | null
          location: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date: string
          event_type?: string | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_date?: string
          event_type?: string | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fixtures: {
        Row: {
          away_score: number | null
          created_at: string | null
          home_score: number | null
          id: string
          is_home: boolean | null
          match_date: string
          match_report: string | null
          opponent: string
          status: Database["public"]["Enums"]["match_status"] | null
          updated_at: string | null
          venue: string
        }
        Insert: {
          away_score?: number | null
          created_at?: string | null
          home_score?: number | null
          id?: string
          is_home?: boolean | null
          match_date: string
          match_report?: string | null
          opponent: string
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string | null
          venue: string
        }
        Update: {
          away_score?: number | null
          created_at?: string | null
          home_score?: number | null
          id?: string
          is_home?: boolean | null
          match_date?: string
          match_report?: string | null
          opponent?: string
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string | null
          venue?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: Database["public"]["Enums"]["gallery_category"] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["gallery_category"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["gallery_category"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          jersey_number: number | null
          name: string
          photo_url: string | null
          position: Database["public"]["Enums"]["player_position"]
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          jersey_number?: number | null
          name: string
          photo_url?: string | null
          position: Database["public"]["Enums"]["player_position"]
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          jersey_number?: number | null
          name?: string
          photo_url?: string | null
          position?: Database["public"]["Enums"]["player_position"]
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_approved: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_approved?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_approved?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          photo_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supporters_messages: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_approved: boolean | null
          is_published: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          is_published?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_approved?: boolean | null
          is_published?: boolean | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin_or_moderator: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      announcement_category:
        | "news"
        | "match_result"
        | "player_update"
        | "club_event"
        | "general"
      gallery_category:
        | "match_days"
        | "training"
        | "events"
        | "team_photos"
        | "community"
      match_status:
        | "upcoming"
        | "live"
        | "completed"
        | "cancelled"
        | "postponed"
      player_position: "goalkeeper" | "defender" | "midfielder" | "forward"
      user_role: "admin" | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_category: [
        "news",
        "match_result",
        "player_update",
        "club_event",
        "general",
      ],
      gallery_category: [
        "match_days",
        "training",
        "events",
        "team_photos",
        "community",
      ],
      match_status: ["upcoming", "live", "completed", "cancelled", "postponed"],
      player_position: ["goalkeeper", "defender", "midfielder", "forward"],
      user_role: ["admin", "moderator"],
    },
  },
} as const
