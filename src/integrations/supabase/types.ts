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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          parsed_rule: Json | null
          rule_text: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          parsed_rule?: Json | null
          rule_text?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          parsed_rule?: Json | null
          rule_text?: string | null
          title?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      announcement_reads: {
        Row: {
          announcement_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          category: string
          content: string | null
          created_at: string
          created_by: string
          id: string
          is_pinned: boolean
          title: string
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_pinned?: boolean
          title: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_pinned?: boolean
          title?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          parsed_rule: Json | null
          rule_text: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          parsed_rule?: Json | null
          rule_text?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          parsed_rule?: Json | null
          rule_text?: string | null
          title?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          cert_type: string
          description: string | null
          id: string
          issued_at: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          cert_type?: string
          description?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          cert_type?: string
          description?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          rules: string | null
          start_time: string | null
          status: string | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          rules?: string | null
          start_time?: string | null
          status?: string | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          rules?: string | null
          start_time?: string | null
          status?: string | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      contest_submissions: {
        Row: {
          competition_id: string
          created_at: string
          github_link: string | null
          id: string
          notes: string | null
          score: number | null
          status: string
          submission_url: string | null
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          github_link?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          status?: string
          submission_url?: string | null
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          github_link?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          status?: string
          submission_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          sort_order: number
          theory_content: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          theory_content?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          theory_content?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dsa_questions: {
        Row: {
          constraints: string | null
          created_at: string
          description: string | null
          difficulty: string
          id: string
          language: string
          sample_input: string | null
          sample_output: string | null
          test_cases: Json
          title: string
        }
        Insert: {
          constraints?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          language?: string
          sample_input?: string | null
          sample_output?: string | null
          test_cases?: Json
          title: string
        }
        Update: {
          constraints?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          language?: string
          sample_input?: string | null
          sample_output?: string | null
          test_cases?: Json
          title?: string
        }
        Relationships: []
      }
      dsa_submissions: {
        Row: {
          code: string
          created_at: string
          feedback: string | null
          id: string
          language: string
          question_id: string
          score: number
          status: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          feedback?: string | null
          id?: string
          language?: string
          question_id: string
          score?: number
          status?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          feedback?: string | null
          id?: string
          language?: string
          question_id?: string
          score?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dsa_submissions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "dsa_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          location: string | null
          max_participants: number | null
          meeting_link: string | null
          speaker: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          speaker?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          speaker?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_code: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_code: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_code?: string
          user_id?: string
        }
        Relationships: []
      }
      project_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_likes: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_likes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          github_link: string | null
          id: string
          is_featured: boolean | null
          likes_count: number | null
          mvp_link: string | null
          name: string
          screenshots: string[] | null
          team_members: string[] | null
          tech_stack: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_link?: string | null
          id?: string
          is_featured?: boolean | null
          likes_count?: number | null
          mvp_link?: string | null
          name: string
          screenshots?: string[] | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          github_link?: string | null
          id?: string
          is_featured?: boolean | null
          likes_count?: number | null
          mvp_link?: string | null
          name?: string
          screenshots?: string[] | null
          team_members?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          quiz_id: string
          selected_answer: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct: boolean
          quiz_id: string
          selected_answer: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          quiz_id?: string
          selected_answer?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          correct_answer: number
          course_id: string
          created_at: string
          id: string
          options: Json
          question: string
          sort_order: number
        }
        Insert: {
          correct_answer: number
          course_id: string
          created_at?: string
          id?: string
          options?: Json
          question: string
          sort_order?: number
        }
        Update: {
          correct_answer?: number
          course_id?: string
          created_at?: string
          id?: string
          options?: Json
          question?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          resource_type: string
          title: string
          url: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          resource_type?: string
          title: string
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          resource_type?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          awarded_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          awarded_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          awarded_at?: string
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
      user_activity: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
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
      whitelist: {
        Row: {
          added_by: string | null
          created_at: string
          id: string
          user_code: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          id?: string
          user_code: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          id?: string
          user_code?: string
        }
        Relationships: []
      }
      xp_logs: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string
          user_id?: string
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
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
      app_role: ["admin", "member"],
    },
  },
} as const
