
import React from "react";
import ChatWindow from "./User/ChatWindow";
import { useSearchParams } from "react-router-dom";

const ChatPage = () => {
  const [params] = useSearchParams();
  const receiverId = params.get("ownerId");

  if (!receiverId) return <div className="text-white">No receiver specified</div>;

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <ChatWindow receiverId={receiverId} />
    </div>
  );
};

export default ChatPage;
