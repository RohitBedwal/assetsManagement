import { createContext } from "react";
import { io } from "socket.io-client";

// Add fallback and better error handling
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const socket = io(BACKEND_URL, {
  autoConnect: false, // Connect manually when needed
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
  transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
});

export const SocketContext = createContext(socket);