
-- Function to get all chat rooms for the current user
CREATE OR REPLACE FUNCTION public.get_user_chat_rooms()
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ,
  metadata JSONB,
  users JSONB,
  unread INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.id,
    CASE 
      WHEN cr.type = 'one_to_one' THEN 
        COALESCE(
          (SELECT up.full_name FROM public.chat_room_members crm2
           JOIN public.user_profiles up ON crm2.user_id = up.id
           WHERE crm2.room_id = cr.id AND crm2.user_id != auth.uid() LIMIT 1),
           cr.name
        )
      ELSE cr.name
    END as name,
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
        FROM public.chat_room_members crm2
        JOIN public.user_profiles up ON crm2.user_id = up.id
        WHERE crm2.room_id = cr.id AND crm2.user_id != auth.uid()
      ),
      '[]'::jsonb
    ) as users,
    COALESCE(
      (SELECT COUNT(*) FROM public.messages m
       WHERE m.room_id = cr.id
       AND m.created_at > crm.last_read_at),
       0
    )::INTEGER as unread
  FROM 
    public.chat_rooms cr
  JOIN
    public.chat_room_members crm ON cr.id = crm.room_id AND crm.user_id = auth.uid()
  ORDER BY 
    cr.last_message_at DESC;
END;
$$;
