import React, { useEffect, useState } from "react";
import { SocketContext, socket } from "./SocketContext";

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect socket
    socket.connect();

    // Event listeners
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("🔥 Socket connection error:", error. message);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket. off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};