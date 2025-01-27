import { io } from "socket.io-client";

// Connect to your backend WebSocket server
const socket = io(`${process.env.REACT_APP_API_URL}`, {
  transports: ["websocket"], // Use WebSocket transport
});

export default socket;
