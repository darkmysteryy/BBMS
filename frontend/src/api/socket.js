// api/socket.js
import { io } from "socket.io-client";

// Connect to the backend server (using the same base URL as axios)
const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace("/api", "") 
  : "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false, // We will manually connect in App.jsx when the app loads
});

export default socket;
