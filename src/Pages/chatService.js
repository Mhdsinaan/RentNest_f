// src/services/chatService.js
import * as signalR from "@microsoft/signalr";

let connection = null;

export const startChatConnection = async (jwtToken) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub", {
      accessTokenFactory: () => jwtToken, // Pass JWT token for authentication
    })
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("Connected to ChatHub");
    return connection;
  } catch (err) {
    console.error("SignalR Connection Error:", err);
    throw err;
  }
};

export const stopChatConnection = async () => {
  if (connection) {
    await connection.stop();
    console.log("Disconnected from ChatHub");
    connection = null;
  }
};

export const sendMessage = async (senderId, receiverId, message) => {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    throw new Error("SignalR connection is not established");
  }
  try {
    await connection.invoke("SendMessage", senderId, receiverId, message);
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};

export const onReceiveMessage = (callback) => {
  if (connection) {
    connection.on("ReceiveMessage", (senderId, message, timestamp) => {
      callback({ senderId, message, timestamp });
    });
  }
};

export const onReceiveMessageHistory = (callback) => {
  if (connection) {
    connection.on("ReceiveMessageHistory", (messages) => {
      callback(messages);
    });
  }
};