
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, MessageCircle } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { format } from 'date-fns';

const Messages = () => {
  const { conversations, messages, selectedConversation, isLoading, selectConversation, sendMessage } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.participant_names.some(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const selectedConv = conversations.find(c => c.id === selectedConversation);
    if (!selectedConv) return;

    const recipientId = selectedConv.participants.find(id => id !== 'user123') || '';
    await sendMessage(newMessage, recipientId);
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'MMM d');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[600px] flex">
        <div className="w-1/3 border-r p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Connect with casting directors, producers, and other industry professionals</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="col-span-4 border rounded-lg">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[540px]">
            <div className="p-4 space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <Avatar>
                    <AvatarImage src={conversation.participant_avatars[0]} />
                    <AvatarFallback>
                      {conversation.participant_names[0]?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {conversation.participant_names[0]}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatConversationTime(conversation.last_message_timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.last_message}
                      </p>
                      {conversation.unread_count > 0 && (
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gold text-white">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div className="col-span-8 border rounded-lg flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.participant_avatars[0]} />
                    <AvatarFallback>
                      {conversations.find(c => c.id === selectedConversation)?.participant_names[0]?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {conversations.find(c => c.id === selectedConversation)?.participant_names[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_name === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.sender_name === 'You' ? 'order-2' : 'order-1'}`}>
                        {message.sender_name !== 'You' && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={message.sender_avatar} />
                              <AvatarFallback className="text-xs">
                                {message.sender_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{message.sender_name}</span>
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender_name === 'You'
                              ? 'bg-gold text-white dark:text-black'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_name === 'You' 
                              ? 'text-white/70 dark:text-black/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="bg-gold hover:bg-gold/90 text-white dark:text-black">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
