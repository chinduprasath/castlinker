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
      events: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string
          id: string
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      film_jobs: {
        Row: {
          application_deadline: string | null
          application_email: string | null
          application_url: string | null
          company: string
          company_logo: string | null
          coordinates: unknown | null
          created_at: string | null
          created_by: string | null
          description: string
          experience_level: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          job_type: string
          location: string
          location_type: string
          requirements: string[] | null
          responsibilities: string[] | null
          role_category: string
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          application_email?: string | null
          application_url?: string | null
          company: string
          company_logo?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          description: string
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          job_type: string
          location: string
          location_type: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          role_category: string
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          application_email?: string | null
          application_url?: string | null
          company?: string
          company_logo?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          experience_level?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          job_type?: string
          location?: string
          location_type?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          role_category?: string
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      industry_courses: {
        Row: {
          created_at: string | null
          created_by: string | null
          hours: number | null
          id: string
          image: string | null
          instructor: string
          is_featured: boolean | null
          lessons: number | null
          level: string | null
          rating: number | null
          reviews: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          hours?: number | null
          id?: string
          image?: string | null
          instructor: string
          is_featured?: boolean | null
          lessons?: number | null
          level?: string | null
          rating?: number | null
          reviews?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          hours?: number | null
          id?: string
          image?: string | null
          instructor?: string
          is_featured?: boolean | null
          lessons?: number | null
          level?: string | null
          rating?: number | null
          reviews?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      industry_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          description: string
          id: string
          image: string | null
          is_featured: boolean | null
          location: string | null
          time: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          description: string
          id?: string
          image?: string | null
          is_featured?: boolean | null
          location?: string | null
          time?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          image?: string | null
          is_featured?: boolean | null
          location?: string | null
          time?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      industry_news: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          category: string | null
          content: string
          created_at: string | null
          date: string | null
          excerpt: string
          id: string
          image: string | null
          is_featured: boolean | null
          read_time: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          date?: string | null
          excerpt: string
          id?: string
          image?: string | null
          is_featured?: boolean | null
          read_time?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          date?: string | null
          excerpt?: string
          id?: string
          image?: string | null
          is_featured?: boolean | null
          read_time?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      industry_resources: {
        Row: {
          created_at: string | null
          created_by: string | null
          downloads: number | null
          file_url: string | null
          id: string
          image: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          downloads?: number | null
          file_url?: string | null
          id?: string
          image?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          downloads?: number | null
          file_url?: string | null
          id?: string
          image?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          additional_files: string[] | null
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string
          resume_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_files?: string[] | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_files?: string[] | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "film_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "film_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      talent_profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string | null
          experience: number | null
          featured_in: string[] | null
          id: string
          is_available: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          location: string
          name: string
          rating: number | null
          reviews: number | null
          role: string
          skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          experience?: number | null
          featured_in?: string[] | null
          id?: string
          is_available?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          location: string
          name: string
          rating?: number | null
          reviews?: number | null
          role: string
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          experience?: number | null
          featured_in?: string[] | null
          id?: string
          is_available?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          location?: string
          name?: string
          rating?: number | null
          reviews?: number | null
          role?: string
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users_management: {
        Row: {
          avatar_url: string | null
          email: string
          id: string
          joined_date: string
          last_active: string
          name: string
          role: Database["public"]["Enums"]["admin_user_role"]
          status: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          email: string
          id?: string
          joined_date?: string
          last_active?: string
          name: string
          role: Database["public"]["Enums"]["admin_user_role"]
          status?: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          email?: string
          id?: string
          joined_date?: string
          last_active?: string
          name?: string
          role?: Database["public"]["Enums"]["admin_user_role"]
          status?: string
          verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_film_jobs: {
        Args: {
          search_term: string
        }
        Returns: {
          application_deadline: string | null
          application_email: string | null
          application_url: string | null
          company: string
          company_logo: string | null
          coordinates: unknown | null
          created_at: string | null
          created_by: string | null
          description: string
          experience_level: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          job_type: string
          location: string
          location_type: string
          requirements: string[] | null
          responsibilities: string[] | null
          role_category: string
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }[]
      }
    }
    Enums: {
      admin_user_role:
        | "actor"
        | "director"
        | "producer"
        | "writer"
        | "cinematographer"
        | "agency"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
