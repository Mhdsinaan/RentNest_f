import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

const ChatWindow = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const connectionRef = useRef(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    console.log("Token:", storedToken);

    if (!storedToken || !storedUser) {
      console.error("❌ No token or user found.");
      return;
    }

    setToken(storedToken);
    setUser(storedUser);
    setTokenLoaded(true);
  }, []);

  useEffect(() => {
    if (!tokenLoaded || !token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7044/chatHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    connection
      .start()
      .then(() => console.log("✅ SignalR connected."))
      .catch((err) => console.error("❌ SignalR error:", err));

    connectionRef.current = connection;

    return () => {
      console.log("Disconnecting SignalR...");
      connection.stop();
    };
  }, [tokenLoaded, token]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const message = {
      SenderId: user.id,
      ReceiverId: receiverId,
      Content: input,
      Timestamp: new Date().toISOString(),
    };

    try {
      await connectionRef.current.invoke("SendMessage", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    } catch (err) {
      console.error("❌ Send error:", err);
    }
  };

  if (!tokenLoaded) {
    return <div className="text-white">🔄 Connecting...</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl mx-auto">
      <div className="h-96 overflow-y-auto border border-gray-300 rounded mb-4 p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.SenderId === user?.id ? "bg-blue-100 text-right" : "bg-gray-100"
            }`}
          >
            {msg.Content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="Type your message"
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
