
-- Function to create a direct message chat room between two users
CREATE OR REPLACE FUNCTION public.create_dm_chat_room(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  existing_room_id UUID;
  new_room_id UUID;
  other_user_name TEXT;
BEGIN
  -- Get the other user's name
  SELECT full_name INTO other_user_name
  FROM public.user_profiles
  WHERE id = other_user_id;
  
  IF other_user_name IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Check if a direct message room already exists between these users
  SELECT room_id INTO existing_room_id
  FROM (
    SELECT room_id, COUNT(*) as member_count
    FROM public.chat_room_members
    WHERE user_id IN (current_user_id, other_user_id)
    GROUP BY room_id
    HAVING COUNT(*) = 2
  ) as room_counts
  WHERE EXISTS (
    SELECT 1 FROM public.chat_rooms
    WHERE chat_rooms.id = room_counts.room_id
    AND chat_rooms.type = 'one_to_one'
  )
  LIMIT 1;
  
  IF existing_room_id IS NOT NULL THEN
    RETURN existing_room_id;
  END IF;
  
  -- Create new room
  INSERT INTO public.chat_rooms (type, name, created_at, updated_at, last_message_at)
  VALUES ('one_to_one', other_user_name, now(), now(), now())
  RETURNING id INTO new_room_id;
  
  -- Add current user as member
  INSERT INTO public.chat_room_members (room_id, user_id, role, joined_at, last_read_at)
  VALUES (new_room_id, current_user_id, 'member', now(), now());
  
  -- Add other user as member
  INSERT INTO public.chat_room_members (room_id, user_id, role, joined_at, last_read_at)
  VALUES (new_room_id, other_user_id, 'member', now(), now());
  
  -- Add system message
  INSERT INTO public.messages (room_id, sender_id, content, type)
  VALUES (new_room_id, current_user_id, 'Chat started', 'system');
  
  RETURN new_room_id;
END;
$$;
