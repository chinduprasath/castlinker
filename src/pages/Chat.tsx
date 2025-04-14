
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChatPage } from "@/components/chat/ChatPage";

// Replace the complex Chat component with a wrapper around our new ChatPage component
const Chat = () => {
  return (
    <Card className="h-[calc(100vh-120px)] border-none rounded-xl overflow-hidden shadow-2xl bg-card/95">
      <ChatPage />
    </Card>
  );
};

export default Chat;
