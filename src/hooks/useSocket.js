import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta. env.VITE_BACKEND_URL || 'http://localhost:4000';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(BACKEND_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance. disconnect();
    };
  }, []);

  return { socket, isConnected };
};