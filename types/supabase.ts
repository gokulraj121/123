export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          user_type: 'single' | 'relationship'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          user_type: 'single' | 'relationship'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          user_type?: 'single' | 'relationship'
          created_at?: string
          updated_at?: string
        }
      }
      user_relationships: {
        Row: {
          id: string
          user_id: string
          partner_id: string
          status: 'pending' | 'active' | 'ended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          partner_id: string
          status: 'pending' | 'active' | 'ended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          partner_id?: string
          status?: 'pending' | 'active' | 'ended'
          created_at?: string
          updated_at?: string
        }
      }
      user_friends: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'active' | 'blocked'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status: 'pending' | 'active' | 'blocked'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'active' | 'blocked'
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          description: string | null
          game_type: 'single' | 'couple' | 'coop'
          min_players: number
          max_players: number
          points_per_completion: number
          bonus_points: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          game_type: 'single' | 'couple' | 'coop'
          min_players: number
          max_players: number
          points_per_completion?: number
          bonus_points?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          game_type?: 'single' | 'couple' | 'coop'
          min_players?: number
          max_players?: number
          points_per_completion?: number
          bonus_points?: number
          created_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          game_id: string
          created_by: string
          status: 'active' | 'completed' | 'abandoned'
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          game_id: string
          created_by: string
          status: 'active' | 'completed' | 'abandoned'
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          game_id?: string
          created_by?: string
          status?: 'active' | 'completed' | 'abandoned'
          created_at?: string
          completed_at?: string | null
        }
      }
      game_session_participants: {
        Row: {
          id: string
          session_id: string
          user_id: string
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          score?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          score?: number
          created_at?: string
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string | null
          room_type: 'direct' | 'group'
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          room_type: 'direct' | 'group'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          room_type?: 'direct' | 'group'
          created_at?: string
        }
      }
      chat_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
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