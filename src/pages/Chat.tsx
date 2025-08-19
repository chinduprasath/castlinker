import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageArea from "@/components/chat/ChatMessageArea";
import ChatInputBar from "@/components/chat/ChatInputBar";
import { collection, getDocs, query, where, doc, updateDoc, addDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { toast } from 'sonner';
import { ChatContainer } from "@/components/chat/ChatContainer";

// Define types for sidebar chats
type SidebarChat = {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar: string;
  role?: string;
  online?: boolean;
} | {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar: string;
  role: string;
  type: 'connection_request';
  requestData: any;
};

const Chat = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<SidebarChat[]>([]);
  const [chatRoomUsers, setChatRoomUsers] = useState<Record<string, { name: string; avatar: string }>>({});
  const [activeChat, setActiveChat] = useState<SidebarChat | null>(null);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [chatRequestResponses, setChatRequestResponses] = useState<Record<string, boolean>>({
    // Pre-accept chat 1 to show messages immediately
    "1": true
  });
  
  const handleSendMessage = (inputMessage: string) => {
    // Remove direct useChat usage here, and instead pass roomId and participants to ChatContainer below
  };

  const handleAcceptChat = () => {
    console.log("Chat accepted:", activeChat?.id);
    setChatRequestResponses(prev => ({
      ...prev,
      [activeChat?.id]: true
    }));
  };

  const handleDeclineChat = () => {
    console.log("Chat declined:", activeChat?.id);
    setChatRequestResponses(prev => ({
      ...prev,
      [activeChat?.id]: false
    }));
  };

  // Fetch pending connection requests for the current user
  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      const q = query(
        collection(db, 'connection_requests'),
        where('recipientId', '==', user.id),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'connection_request' }));
      setConnectionRequests(requests);
    };
    fetchRequests();
  }, [user]);

  // Fetch connected users
  useEffect(() => {
    if (!user) return;
    const fetchConnectedUsers = async () => {
      try {
        // Find all accepted connections where user is requester or recipient
        const connectionsRef = collection(db, 'connection_requests');
        const q = query(connectionsRef, where('status', '==', 'accepted'));
        const snapshot = await getDocs(q);
        const connections = snapshot.docs.map(doc => doc.data());
        
        // Get user IDs of connected users
        const connectedIds = connections
          .filter(c => c.requesterId === user.id || c.recipientId === user.id)
          .map(c => (c.requesterId === user.id ? c.recipientId : c.requesterId));
        
        if (connectedIds.length === 0) {
          setConnectedUsers([]);
          return;
        }
        
        // Fetch user details for connected users
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
         const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         const connectedUsersData = users
           .filter(u => connectedIds.includes(u.id))
           .map((userData: any) => ({
             id: userData.id,
             name: userData.full_name || userData.name || 'Unknown User',
             avatar: userData.avatar_url || userData.avatar || '/placeholder.svg',
             online: false, // Could be enhanced with real-time presence
             role: userData.role || ''
           }));
        
        setConnectedUsers(connectedUsersData);
      } catch (error) {
        console.error('Error fetching connected users:', error);
        setConnectedUsers([]);
      }
    };
    fetchConnectedUsers();
  }, [user]);

  // Fetch groups (for future implementation)
  useEffect(() => {
    if (!user) return;
    const fetchGroups = async () => {
      try {
        const q = query(
          collection(db, 'chat_rooms'),
          where('participants', 'array-contains', user.id),
          where('type', '==', 'group')
        );
        const snapshot = await getDocs(q);
        const groupsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Group Chat',
            lastMessage: data.metadata?.last_message || '',
            lastMessageTime: data.last_message_at ? new Date(data.last_message_at).toLocaleString() : '',
            unread: 0,
            avatar: '/placeholder.svg',
            memberCount: data.participants?.length || 0
          };
        });
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
      }
    };
    fetchGroups();
  }, [user]);

  // Fetch chat rooms from Firestore for the current user
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'chat_rooms'),
      where('participants', 'array-contains', user.id)
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const rooms = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Chat',
          lastMessage: data.metadata?.last_message || '',
          lastMessageTime: data.last_message_at ? new Date(data.last_message_at).toLocaleString() : '',
          unread: 0,
          avatar: '/placeholder.svg',
          role: '',
          online: false,
          participants: data.participants || [],
          ...data
        };
      });
      setChatRooms(rooms);

      // Fetch user details for each chat room (other participant)
      const userFetches = await Promise.all(
        rooms.map(async (room) => {
          if (!room.participants || room.participants.length !== 2) return [room.id, { name: 'Unknown', avatar: '/placeholder.svg' }];
          const otherUserId = room.participants.find((id: string) => id !== user.id);
          if (!otherUserId) return [room.id, { name: 'Unknown', avatar: '/placeholder.svg' }];
          try {
            const userDoc = await getDoc(doc(db, 'users', otherUserId));
            const userData = userDoc.exists() ? userDoc.data() : null;
            return [room.id, {
              name: userData?.full_name || userData?.name || 'Unknown',
              avatar: userData?.avatar_url || userData?.avatar || '/placeholder.svg'
            }];
          } catch {
            return [room.id, { name: 'Unknown', avatar: '/placeholder.svg' }];
          }
        })
      );
      const userMap: Record<string, { name: string; avatar: string }> = {};
      userFetches.forEach(([roomId, info]) => {
        userMap[roomId as string] = info as { name: string; avatar: string };
      });
      setChatRoomUsers(userMap);
    });
    return () => unsubscribe();
  }, [user]);

  // Combine chats and connection requests for sidebar
  const sidebarChats: SidebarChat[] = [
    ...connectionRequests.map(req => ({
      id: req.id,
      name: req.requesterName || 'Connection Request',
      lastMessage: req.message || 'Connection request',
      lastMessageTime: req.createdAt ? new Date(req.createdAt).toLocaleString() : '',
      unread: 1,
      avatar: req.requesterAvatar || '/placeholder.svg',
      role: 'Connection Request',
      type: 'connection_request',
      requestData: req
    })),
    ...chatRooms.map(room => ({
      ...room,
      name: chatRoomUsers[room.id]?.name || 'Chat',
      avatar: chatRoomUsers[room.id]?.avatar || '/placeholder.svg'
    }))
  ];

  // Accept/Decline handlers for connection requests
  const handleAcceptRequest = async (request) => {
    try {
      await updateDoc(doc(db, 'connection_requests', request.id), { status: 'accepted' });
      // Notify requester
      await addDoc(collection(db, 'notifications'), {
        user_id: request.requesterId,
        message: `${user.name} accepted your connection request!`,
        created_at: new Date().toISOString(),
        read: false,
        type: 'connection',
      });
      // Create chat room
      const chatRoomRef = await addDoc(collection(db, 'chat_rooms'), {
        type: 'one_to_one',
        name: `${user.name} & ${request.requesterName}`,
        participants: [user.id, request.requesterId],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: '',
        metadata: {},
      });
      toast.success('Connection request accepted! Chat room created.');
      setConnectionRequests((prev) => prev.filter((r) => r.id !== request.id));
      // Select the new chat room
      setActiveChat({
        id: chatRoomRef.id,
        name: `${user.name} & ${request.requesterName}`,
        lastMessage: '',
        lastMessageTime: '',
        unread: 0,
        avatar: '/placeholder.svg',
        role: '',
        online: false
      });
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  const handleDeclineRequest = async (request) => {
    try {
      await updateDoc(doc(db, 'connection_requests', request.id), { status: 'declined' });
      // Notify requester
      await addDoc(collection(db, 'notifications'), {
        user_id: request.requesterId,
        message: `${user.name} declined your connection request.`,
        created_at: new Date().toISOString(),
        read: false,
        type: 'connection',
      });
      toast('Connection request declined');
      setConnectionRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (err) {
      toast.error('Failed to decline request');
    }
  };

  const handleCreateGroup = (groupName: string, members: string[]) => {
    const newGroup = {
      id: `group_${Date.now()}`,
      name: groupName,
      lastMessage: "Group created",
      lastMessageTime: "now",
      unread: 0,
      avatar: `/api/placeholder/40/40`,
      memberCount: members.length + 1, // +1 for the current user
      members: members,
      type: 'group'
    };
    setGroups(prev => [...prev, newGroup]);
  };

  // Determine if the selected chat is a connection request
  const isConnectionRequest = activeChat && 'type' in activeChat && activeChat.type === 'connection_request';

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white text-gray-900 dark:bg-[#181818] dark:text-white min-h-screen">
      <ChatSidebar 
        chats={sidebarChats}
        connectedUsers={connectedUsers}
        groups={groups}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateGroup={handleCreateGroup}
      />
      
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100">
        {!activeChat ? (
          <div className="flex items-center justify-center h-full bg-white text-gray-400 dark:bg-[#181818] dark:text-gray-300 transition-colors">
            Select a conversation to start messaging
          </div>
        ) : isConnectionRequest && activeChat && 'requestData' in activeChat ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-[#222] p-8 rounded-lg shadow-lg max-w-md w-full text-center">
              <h2 className="text-2xl font-bold mb-2">Connection Request</h2>
              <p className="mb-4">{activeChat.requestData.requesterName} wants to connect with you.</p>
              <p className="mb-4 italic text-gray-400">"{activeChat.requestData.message}"</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => handleAcceptRequest(activeChat.requestData)}
                >
                  Accept
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => handleDeclineRequest(activeChat.requestData)}
                >
                  Not Interested
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ChatHeader chat={activeChat} />
            <ChatContainer 
              roomId={activeChat.id}
              participants={Array.isArray((activeChat as any).participants) ? (activeChat as any).participants : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
