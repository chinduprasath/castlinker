
-- Function to create or retrieve a direct message chat room between two users
CREATE OR REPLACE FUNCTION public.create_dm_chat_room(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  room_id UUID;
  other_user_name TEXT;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to create a chat room';
  END IF;
  
  -- Check if the other user exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = other_user_id) THEN
    RAISE EXCEPTION 'The specified user does not exist';
  END IF;
  
  -- Check if a DM room already exists between these two users
  SELECT cr.id INTO room_id
  FROM public.chat_rooms cr
  JOIN public.chat_room_members crm1 ON cr.id = crm1.room_id
  JOIN public.chat_room_members crm2 ON cr.id = crm2.room_id
  WHERE cr.type = 'one_to_one'
  AND crm1.user_id = current_user_id
  AND crm2.user_id = other_user_id;
  
  -- If a room exists, return it
  IF room_id IS NOT NULL THEN
    RETURN room_id;
  END IF;
  
  -- Get the other user's name for the room name
  SELECT full_name INTO other_user_name
  FROM public.profiles
  WHERE id = other_user_id;
  
  -- Create a new room
  INSERT INTO public.chat_rooms (
    name,
    type,
    metadata
  )
  VALUES (
    other_user_name,
    'one_to_one',
    jsonb_build_object(
      'created_by', current_user_id,
      'participants', jsonb_build_array(current_user_id, other_user_id)
    )
  )
  RETURNING id INTO room_id;
  
  -- Add both users to the room
  INSERT INTO public.chat_room_members (room_id, user_id, role)
  VALUES 
    (room_id, current_user_id, 'member'),
    (room_id, other_user_id, 'member');
  
  -- Create a system message
  INSERT INTO public.messages (
    room_id,
    sender_id,
    content,
    type
  )
  VALUES (
    room_id,
    current_user_id,
    'Chat started',
    'system'
  );
  
  RETURN room_id;
END;
$$;
