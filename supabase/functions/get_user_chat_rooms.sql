
-- Function to get all chat rooms for a user
CREATE OR REPLACE FUNCTION public.get_user_chat_rooms()
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
        JOIN public.profiles up ON crm.user_id = up.id
        WHERE crm.room_id = cr.id AND crm.user_id != auth.uid()
      ),
      '[]'::jsonb
    ) as users
  FROM 
    public.chat_rooms cr
  JOIN 
    public.chat_room_members crm ON cr.id = crm.room_id
  WHERE 
    crm.user_id = auth.uid()
  ORDER BY 
    cr.last_message_at DESC NULLS LAST;
END;
$$;
