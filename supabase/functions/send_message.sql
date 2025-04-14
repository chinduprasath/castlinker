
-- Function to send a message to a chat room
CREATE OR REPLACE FUNCTION public.send_message(
  room_id UUID,
  content TEXT,
  message_type TEXT DEFAULT 'text'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_message_id UUID;
BEGIN
  -- Check if the user is a member of the room
  IF NOT EXISTS (
    SELECT 1 FROM public.chat_room_members
    WHERE room_id = send_message.room_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'You are not a member of this chat room';
  END IF;
  
  -- Insert the message
  INSERT INTO public.messages (
    room_id,
    sender_id,
    content,
    type
  )
  VALUES (
    send_message.room_id,
    auth.uid(),
    send_message.content,
    send_message.message_type
  )
  RETURNING id INTO new_message_id;
  
  -- Update chat room's last_message_at
  UPDATE public.chat_rooms
  SET 
    last_message_at = now(),
    metadata = jsonb_set(
      metadata,
      '{last_message}',
      to_jsonb(content)
    )
  WHERE id = send_message.room_id;
  
  -- Update the sender's last_read_at
  UPDATE public.chat_room_members
  SET last_read_at = now()
  WHERE room_id = send_message.room_id
  AND user_id = auth.uid();
  
  RETURN new_message_id;
END;
$$;
