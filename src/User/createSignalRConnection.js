import * as signalR from "@microsoft/signalr";
import ChatWindow from "./ChatWindow";

const createSignalRConnection = (userId, accessToken) => {
  console.log("Connecting with token:", accessToken); // ✅ Debug line

  return new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7044/chatHub", {
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect()
    .build();
};

export default createSignalRConnection;
