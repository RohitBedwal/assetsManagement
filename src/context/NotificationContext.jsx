import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    // Load notifications from localStorage on init
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title, message) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      createdAt: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
