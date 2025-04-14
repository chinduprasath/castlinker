
-- Function to get chat room information with its users
CREATE OR REPLACE FUNCTION public.get_chat_room(room_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ,
  metadata JSONB,
  users JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user has access to this room
  IF NOT EXISTS (
    SELECT 1 FROM public.chat_room_members
    WHERE room_id = get_chat_room.room_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT 
    cr.id,
    cr.name,
    cr.type,
    cr.created_at,
    cr.updated_at,
    cr.last_message_at,
    cr.metadata,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', up.id,
            'full_name', up.full_name,
            'avatar_url', up.avatar_url,
            'role', up.role
          )
        )
        FROM public.chat_room_members crm
        JOIN public.user_profiles up ON crm.user_id = up.id
        WHERE crm.room_id = cr.id AND crm.user_id != auth.uid()
      ),
      '[]'::jsonb
    ) as users
  FROM 
    public.chat_rooms cr
  WHERE 
    cr.id = get_chat_room.room_id;
END;
$$;

