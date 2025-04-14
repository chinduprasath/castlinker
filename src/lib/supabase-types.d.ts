
// This file contains TypeScript definitions for Supabase RPC functions

declare module 'supabase-rpc-types' {
  interface SupabaseRpcFunctions {
    check_user_is_team_head: (args: { project_id: string; user_uuid: string }) => boolean;
    check_user_project_membership: (args: { project_id: string; user_uuid: string }) => boolean;
    search_film_jobs: (args: { search_term: string }) => any[];
    get_chat_room: (args: { room_id: string }) => any;
    get_room_messages: (args: { room_id: string }) => any;
    get_user_chat_rooms: () => any;
    send_message: (args: { room_id: string; content: string; message_type?: string }) => any;
    create_dm_chat_room: (args: { other_user_id: string }) => any;
  }
}

// Extend the Supabase client type
declare module "@supabase/supabase-js" {
  interface SupabaseClient {
    rpc<T extends keyof import('supabase-rpc-types').SupabaseRpcFunctions>(
      fn: T,
      params?: Parameters<import('supabase-rpc-types').SupabaseRpcFunctions[T]>[0]
    ): PostgrestFilterBuilder<any, any, unknown>;
  }

  // Export User and Session types
  export interface User {
    id: string;
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      [key: string]: any;
    };
    aud: string;
    confirmation_sent_at?: string;
    email?: string;
    created_at: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    role?: string;
    updated_at?: string;
  }

  export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
    user: User;
  }
}
