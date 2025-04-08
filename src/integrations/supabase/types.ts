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
      campus: {
        Row: {
          cod_campus: number
          nome_campus: string
          regiao: number
          sigla_campus: string
          sigla_campus_siaa: string
        }
        Insert: {
          cod_campus: number
          nome_campus: string
          regiao: number
          sigla_campus: string
          sigla_campus_siaa: string
        }
        Update: {
          cod_campus?: number
          nome_campus?: string
          regiao?: number
          sigla_campus?: string
          sigla_campus_siaa?: string
        }
        Relationships: []
      }
      disciplinas: {
        Row: {
          cod_disciplina: number
          nome_disciplina: string
        }
        Insert: {
          cod_disciplina: number
          nome_disciplina: string
        }
        Update: {
          cod_disciplina?: number
          nome_disciplina?: string
        }
        Relationships: []
      }
      disponibilidade_docente: {
        Row: {
          campus: number[] | null
          cod_docente: number | null
          data_registro: string | null
          disciplinas: number[] | null
          horarios: number[] | null
          id: number
          semestre: string
        }
        Insert: {
          campus?: number[] | null
          cod_docente?: number | null
          data_registro?: string | null
          disciplinas?: number[] | null
          horarios?: number[] | null
          id?: number
          semestre: string
        }
        Update: {
          campus?: number[] | null
          cod_docente?: number | null
          data_registro?: string | null
          disciplinas?: number[] | null
          horarios?: number[] | null
          id?: number
          semestre?: string
        }
        Relationships: [
          {
            foreignKeyName: "disponibilidade_docente_cod_docente_fkey"
            columns: ["cod_docente"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["cod_docente"]
          },
        ]
      }
      docentes: {
        Row: {
          cod_docente: number
          email_docente: string
          nome_docente: string
        }
        Insert: {
          cod_docente: number
          email_docente: string
          nome_docente: string
        }
        Update: {
          cod_docente?: number
          email_docente?: string
          nome_docente?: string
        }
        Relationships: []
      }
      grade: {
        Row: {
          cod_campus: number | null
          cod_disciplina: number | null
          cod_docente: number | null
          cod_horario: number | null
          cod_oferta: number
          dia_semana: string | null
          horario_fim: string | null
          horario_inicio: string | null
          nome_campus: string | null
          nome_disciplina: string | null
          nome_docente: string | null
          periodo: string | null
          semestre: string | null
          sigla_campus: string | null
        }
        Insert: {
          cod_campus?: number | null
          cod_disciplina?: number | null
          cod_docente?: number | null
          cod_horario?: number | null
          cod_oferta: number
          dia_semana?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          nome_campus?: string | null
          nome_disciplina?: string | null
          nome_docente?: string | null
          periodo?: string | null
          semestre?: string | null
          sigla_campus?: string | null
        }
        Update: {
          cod_campus?: number | null
          cod_disciplina?: number | null
          cod_docente?: number | null
          cod_horario?: number | null
          cod_oferta?: number
          dia_semana?: string | null
          horario_fim?: string | null
          horario_inicio?: string | null
          nome_campus?: string | null
          nome_disciplina?: string | null
          nome_docente?: string | null
          periodo?: string | null
          semestre?: string | null
          sigla_campus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_cod_campus_fkey"
            columns: ["cod_campus"]
            isOneToOne: false
            referencedRelation: "campus"
            referencedColumns: ["cod_campus"]
          },
          {
            foreignKeyName: "grade_cod_disciplina_fkey"
            columns: ["cod_disciplina"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["cod_disciplina"]
          },
          {
            foreignKeyName: "grade_cod_docente_fkey"
            columns: ["cod_docente"]
            isOneToOne: false
            referencedRelation: "docentes"
            referencedColumns: ["cod_docente"]
          },
          {
            foreignKeyName: "grade_cod_horario_fkey"
            columns: ["cod_horario"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["cod_horario"]
          },
        ]
      }
      horarios: {
        Row: {
          cod_horario: number
          dia_semana: string
          horario_fim_1: string
          horario_fim_2: string | null
          horario_inicio_1: string
          horario_inicio_2: string | null
          nome_horario: string
          periodo: string
        }
        Insert: {
          cod_horario: number
          dia_semana: string
          horario_fim_1: string
          horario_fim_2?: string | null
          horario_inicio_1: string
          horario_inicio_2?: string | null
          nome_horario: string
          periodo: string
        }
        Update: {
          cod_horario?: number
          dia_semana?: string
          horario_fim_1?: string
          horario_fim_2?: string | null
          horario_inicio_1?: string
          horario_inicio_2?: string | null
          nome_horario?: string
          periodo?: string
        }
        Relationships: []
      }
      network_tests: {
        Row: {
          building: string
          campus: string
          created_at: string
          download_speed: number | null
          email: string
          floor: string
          id: string
          ipv4: string | null
          ipv6: string | null
          latency: number | null
          notes: string | null
          room: string
          speed_data: Json | null
          test_id: string
          ticket_number: string | null
          upload_speed: number | null
        }
        Insert: {
          building: string
          campus: string
          created_at?: string
          download_speed?: number | null
          email: string
          floor: string
          id?: string
          ipv4?: string | null
          ipv6?: string | null
          latency?: number | null
          notes?: string | null
          room: string
          speed_data?: Json | null
          test_id: string
          ticket_number?: string | null
          upload_speed?: number | null
        }
        Update: {
          building?: string
          campus?: string
          created_at?: string
          download_speed?: number | null
          email?: string
          floor?: string
          id?: string
          ipv4?: string | null
          ipv6?: string | null
          latency?: number | null
          notes?: string | null
          room?: string
          speed_data?: Json | null
          test_id?: string
          ticket_number?: string | null
          upload_speed?: number | null
        }
        Relationships: []
      }
      otp_verification: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          is_used: boolean
          otp: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          is_used?: boolean
          otp: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          otp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
