
-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('one_to_one', 'group')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create chat_room_members table
CREATE TABLE IF NOT EXISTS public.chat_room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_read_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (room_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'audio', 'document', 'system')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to chat_rooms
CREATE TRIGGER update_chat_rooms_timestamp
BEFORE UPDATE ON public.chat_rooms
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Apply trigger to messages
CREATE TRIGGER update_messages_timestamp
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Create basic RLS policies
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS for chat_rooms: Users can view rooms they are a member of
CREATE POLICY "Users can view their rooms" ON public.chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 
      FROM public.chat_room_members 
      WHERE room_id = id AND user_id = auth.uid()
    )
  );

-- RLS for chat_room_members: Users can view memberships for rooms they belong to
CREATE POLICY "Users can view room members" ON public.chat_room_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 
      FROM public.chat_room_members 
      WHERE room_id = room_id AND user_id = auth.uid()
    )
  );

-- RLS for messages: Users can view messages in rooms they are members of
CREATE POLICY "Users can view messages in their rooms" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 
      FROM public.chat_room_members 
      WHERE room_id = room_id AND user_id = auth.uid()
    )
  );

-- RLS for messages: Users can insert messages in rooms they are members of
CREATE POLICY "Users can send messages to their rooms" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.chat_room_members 
      WHERE room_id = room_id AND user_id = auth.uid()
    ) 
    AND sender_id = auth.uid()
  );

-- RLS for messages: Users can update their own messages
CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());
