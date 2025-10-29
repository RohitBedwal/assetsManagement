import React, { createContext, useContext, useState } from "react";
import { initialDevices } from "../pages/devices/data";

const DeviceContext = createContext();

export function DeviceProvider({ children }) {
  const [devices, setDevices] = useState(
    initialDevices.map((d) => ({
      ...d,
      status: d.status || "inward",
      projectName: d.projectName || null,
    }))
  );

  const updateDevice = (id, updates) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const addDevice = (device) => {
    setDevices((prev) => [device, ...prev]);
  };

  return (
    <DeviceContext.Provider value={{ devices, updateDevice, addDevice }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  return useContext(DeviceContext);
}
