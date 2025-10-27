import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

function Chat({ senderId, receiverId, listingRequestId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const connectionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7044/chathub", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
        connection.invoke("JoinChat", senderId); // optional group join
      })
      .catch((err) => console.error("SignalR connection error", err));

    connection.on("ReceiveMessage", (messageSenderId, messageText, listingId) => {
      setMessages((prev) => [
        ...prev,
        { senderId: messageSenderId, messageText, listingRequestId: listingId },
      ]);
    });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [senderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await connectionRef.current.invoke(
        "SendMessage",
        senderId,
        receiverId,
        input,
        listingRequestId
      );
      setMessages((prev) => [
        ...prev,
        { senderId, messageText: input, listingRequestId },
      ]);
      setInput("");
    } catch (err) {
      console.error("SendMessage error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Chat</h2>
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg w-fit max-w-[75%] ${
              m.senderId === senderId
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-200 text-black"
            }`}
          >
            <span className="text-sm font-semibold block mb-1">
              {m.senderId === senderId ? "You" : `User ${m.senderId}`}
            </span>
            <span>{m.messageText}</span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
