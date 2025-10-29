// src/pages/Devices/data.js
export const initialCategories = [
  { id: 1, name: "Laptops", description: "Portable computers used by staff" },
  { id: 2, name: "Desktops", description: "Office desktops and workstations" },
  { id: 3, name: "Cameras", description: "Security and media cameras" },
];

export const initialDevices = [
  {
    id: 1,
    sku: "LAP-001",
    categoryId: 1,
    type: "Laptop",
    serial: "SN123456",
    hostname: "Laptop-01",
    assignedTo: "Alice Johnson",
  },
  {
    id: 2,
    sku: "LAP-002",
    categoryId: 1,
    type: "Laptop",
    serial: "SN789012",
    hostname: "Laptop-02",
    assignedTo: "Bob Williams",
  },
  {
    id: 3,
    sku: "CAM-001",
    categoryId: 3,
    type: "Camera",
    serial: "SN987654",
    hostname: "Cam-Lobby",
    assignedTo: "Security Team",
  },
];
