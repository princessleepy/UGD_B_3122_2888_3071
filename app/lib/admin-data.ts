export const ports = [
  { id: 1, name: "Jakarta Port" },
  { id: 2, name: "Surabaya Port" },
  { id: 3, name: "Singapore Port" },
  { id: 4, name: "Rotterdam Port" },
  { id: 5, name: "Hamburg Port" },
];

export const users = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi.santoso@example.id",
    role: "Port Operator",
    port_id: 1,
    shift: "08:00 - 16:00",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Clara Wijaya",
    email: "clara.wijaya@example.id",
    role: "Port Operator",
    port_id: 3,
    shift: "16:00 - 00:00",
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "Andi Pratama",
    email: "andi.pratama@example.id",
    role: "Port Operator",
    port_id: 4,
    shift: "08:00 - 16:00",
    status: "INACTIVE"
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi.lestari@example.id",
    role: "Port Operator",
    port_id: 5,
    shift: "08:00 - 16:00",
    status: "ACTIVE"
  },
    {
    id: 5,
    name: "Rizky Hidayat",
    email: "rizky.hidayat@example.id",
    role: "Port Operator",
    port_id: 2,
    shift: "00:00 - 08:00",
    status: "ACTIVE"
  },
  {
    id: 6,
    name: "Siti Rahma",
    email: "siti.rahma@example.id",
    role: "Port Operator",
    port_id: 1,
    shift: "16:00 - 00:00",
    status: "ACTIVE"
  }
];


export const alerts = [
  {
    id: 1,
    type: "CRITICAL",
    title: "Critical Engine Failure",
    time: "04:12 WIB",
    desc: "MV ORION STAR reports pressure drop in Cylinder 4.",
    color: "rose"
  },
  {
    id: 2,
    type: "WARNING",
    title: "Weather Warning",
    time: "02:45 WIB",
    desc: "Cyclone approaching Route A7. Recommend detour.",
    color: "purple"
  },
  {
    id: 3,
    type: "INFO",
    title: "ETA Delay Prediction",
    time: "01:15 WIB",
    desc: "Port congestion detected, delay expected.",
    color: "gray"
  },
  {
    id: 4,
    type: "CRITICAL",
    title: "Navigation System Error",
    time: "00:30 WIB",
    desc: "GPS mismatch detected on vessel route.",
    color: "rose"
  },
  {
    id: 5,
    type: "WARNING",
    title: "Fuel Consumption Spike",
    time: "Yesterday",
    desc: "Unusual fuel usage detected in last 6 hours.",
    color: "purple"
  }
];