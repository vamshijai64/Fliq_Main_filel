// src/socket.js
import { io } from "socket.io-client";

// Ensure you're using the correct backend URL
const socket = io("http://localhost:3003", {
  transports: ["websocket"], // WebSocket transport for efficiency
});

socket.on("connect", () => {
  console.log("✅ Connected to the Socket.IO server");
});

socket.on("connect_error", (err) => {
  console.error("Connection Error:", err);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from the server");
});

export default socket;
