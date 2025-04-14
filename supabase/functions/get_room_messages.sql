
-- Function to get messages for a specific chat room
CREATE OR REPLACE FUNCTION public.get_room_messages(room_id UUID)
RETURNS TABLE (
  id UUID,
  room_id UUID,
  sender_id UUID,
  content TEXT,
  type TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_edited BOOLEAN,
  is_deleted BOOLEAN,
  reply_to_id UUID,
  sender JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user has access to this room
  IF NOT EXISTS (
    SELECT 1 FROM public.chat_room_members
    WHERE room_id = get_room_messages.room_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT 
    m.id,
    m.room_id,
    m.sender_id,
    m.content,
    m.type,
    m.metadata,
    m.created_at,
    m.updated_at,
    m.is_edited,
    m.is_deleted,
    m.reply_to_id,
    jsonb_build_object(
      'id', up.id,
      'full_name', up.full_name,
      'avatar_url', up.avatar_url,
      'role', up.role
    ) as sender
  FROM 
    public.messages m
  LEFT JOIN
    public.user_profiles up ON m.sender_id = up.id
  WHERE 
    m.room_id = get_room_messages.room_id
  ORDER BY 
    m.created_at ASC;
END;
$$;
