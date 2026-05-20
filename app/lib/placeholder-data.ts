const NEON_HORIZON = {
  id: "19910011",
  name: "NEON HORIZON",
  status: "EN ROUTE",
  statusColor: "text-emerald-500",
  location: "Jakarta Port",
  destination: "SINGAPORE [SIN]",
  speed: "14.2 KN",
  fuel: 85.2,
  fuelText: "REMAINING",
  eta: "2024.05.22 / 14:30",
  type: "ELECTRONICS",
  weather: "CLEAR",
  weatherIcon: "☀️",
  score: 96.5,
  update: "2M AGO",
  progress: 100,
  color: "bg-[#bc66ff]"
};

const OCEAN_STAR = {
  id: "19910022",
  name: "OCEAN STAR",
  status: "MAINTENANCE",
  statusColor: "text-rose-500",
  location: "Surabaya Port",
  destination: "ROTTERDAM [RTM]",
  speed: "0.0 KN",
  fuel: 28.4,
  fuelText: "CRITICAL",
  eta: "---",
  type: "RAW MATERIALS",
  weather: "STORMY",
  weatherIcon: "⛈️",
  score: 68.2,
  update: "5M AGO",
  progress: 45,
  failure: "FUEL PUMP 4",
  temp: "92°C",
  color: "bg-rose-500"
};

const SEA_VOYAGER = {
  id: "20030033",
  name: "SEA VOYAGER",
  status: "IN PORT",
  statusColor: "text-indigo-500",
  location: "Medan Port",
  destination: "LOS ANGELES [LAX]",
  speed: "0.2 KN",
  fuel: 62.1,
  fuelText: "NOMINAL",
  eta: "2024.05.23 / 11:45",
  type: "MEDICAL",
  weather: "FOGGY",
  weatherIcon: "🌫️",
  score: 92.1,
  update: "12M AGO",
  progress: 12,
  color: "bg-indigo-400"
};

const ARCTIC_GALE = {
  id: "20040044",
  name: "ARCTIC GALE",
  status: "EN ROUTE",
  statusColor: "text-emerald-500",
  location: "Balikpapan Port",
  destination: "SHANGHAI [PVG]",
  speed: "18.5 KN",
  fuel: 91.7,
  fuelText: "FUELLED",
  eta: "2024.05.24 / 08:00",
  type: "ELECTRONICS",
  weather: "RAIN",
  weatherIcon: "🌧️",
  score: 89.4,
  update: "44M AGO",
  progress: 65,
  color: "bg-emerald-400"
};

const PACIFIC_DRIFT = {
  id: "20050055",
  name: "PACIFIC DRIFT",
  status: "ANCHORAGE",
  statusColor: "text-amber-500",
  location: "Palembang Port",
  destination: "SYDNEY [SYD]",
  speed: "1.1 KN",
  fuel: 45.8,
  fuelText: "NOMINAL",
  eta: "2024.05.22 / 18:00",
  type: "RAW MATERIALS",
  weather: "CLEAR",
  weatherIcon: "☀️",
  score: 84.7,
  update: "1M AGO",
  progress: 95,
  color: "bg-amber-400"
};

export const dashboardStats = [
  { label: "VESSELS EN ROUTE", value: "02", sub: "+3%", subColor: "text-emerald-400" },
  { label: "IN PORT", value: "01", sub: "STABLE", subColor: "text-gray-600" }, // Disesuaikan: Sea Voyager (1)
  { label: "ANCHORAGE", value: "01", sub: "WAITING", subColor: "text-amber-500" }, // Disesuaikan: Pacific Drift (1)
  { label: "MAINTENANCE", value: "01", sub: "ALERT", subColor: "text-rose-500" }, // Disesuaikan: Ocean Star (1)
];

export const vesselData = [
  { name: NEON_HORIZON.name, location: NEON_HORIZON.location, eta: NEON_HORIZON.eta, status: NEON_HORIZON.status, statusColor: NEON_HORIZON.statusColor, update: NEON_HORIZON.update },
  { name: OCEAN_STAR.name, location: OCEAN_STAR.location, eta: OCEAN_STAR.eta, status: OCEAN_STAR.status, statusColor: OCEAN_STAR.statusColor, update: OCEAN_STAR.update },
  { name: SEA_VOYAGER.name, location: SEA_VOYAGER.location, eta: SEA_VOYAGER.eta, status: SEA_VOYAGER.status, statusColor: SEA_VOYAGER.statusColor, update: SEA_VOYAGER.update },
  { name: ARCTIC_GALE.name, location: ARCTIC_GALE.location, eta: ARCTIC_GALE.eta, status: ARCTIC_GALE.status, statusColor: ARCTIC_GALE.statusColor, update: ARCTIC_GALE.update },
  { name: PACIFIC_DRIFT.name, location: PACIFIC_DRIFT.location, eta: PACIFIC_DRIFT.eta, status: PACIFIC_DRIFT.status, statusColor: PACIFIC_DRIFT.statusColor, update: PACIFIC_DRIFT.update },
];

export const maintenanceData = [
  { name: NEON_HORIZON.name, progress: 100, eta: "READY", status: "ACTIVE", engineEff: "94%", nextService: "12 DAYS" },
  { name: OCEAN_STAR.name, progress: OCEAN_STAR.progress, eta: "45H", status: "CRITICAL", failure: OCEAN_STAR.failure, temp: OCEAN_STAR.temp },
  { name: SEA_VOYAGER.name, progress: SEA_VOYAGER.progress, eta: "120H", status: "PLANNED", hullInspect: "PENDING", location: SEA_VOYAGER.location },
];

export const mapVesselData = [
  { id: NEON_HORIZON.id, name: NEON_HORIZON.name, status: NEON_HORIZON.status, statusColor: NEON_HORIZON.statusColor, speed: NEON_HORIZON.speed, destination: NEON_HORIZON.destination },
  { id: OCEAN_STAR.id, name: OCEAN_STAR.name, status: OCEAN_STAR.status, statusColor: OCEAN_STAR.statusColor, speed: OCEAN_STAR.speed, destination: OCEAN_STAR.destination },
  { id: SEA_VOYAGER.id, name: SEA_VOYAGER.name, status: SEA_VOYAGER.status, statusColor: SEA_VOYAGER.statusColor, speed: SEA_VOYAGER.speed, destination: SEA_VOYAGER.destination },
  { id: ARCTIC_GALE.id, name: ARCTIC_GALE.name, status: ARCTIC_GALE.status, statusColor: ARCTIC_GALE.statusColor, speed: ARCTIC_GALE.speed, destination: ARCTIC_GALE.destination },
  { id: PACIFIC_DRIFT.id, name: PACIFIC_DRIFT.name, status: PACIFIC_DRIFT.status, statusColor: PACIFIC_DRIFT.statusColor, speed: PACIFIC_DRIFT.speed, destination: PACIFIC_DRIFT.destination },
];

export const shipmentData = [
  { id: "#STN-1991", vessel: NEON_HORIZON.name, type: NEON_HORIZON.type, destination: NEON_HORIZON.destination, weather: NEON_HORIZON.weather, weatherIcon: NEON_HORIZON.weatherIcon, quantity: "14,200 MT", status: "ON ROUTE", statusColor: "text-emerald-400 bg-emerald-400/10" },
  { id: "#STN-1992", vessel: OCEAN_STAR.name, type: OCEAN_STAR.type, destination: OCEAN_STAR.destination, weather: OCEAN_STAR.weather, weatherIcon: OCEAN_STAR.weatherIcon, quantity: "62,500 MT", status: "DELAYED", statusColor: "text-rose-500 bg-rose-500/10", alert: true },
  { id: "#STN-2003", vessel: SEA_VOYAGER.name, type: SEA_VOYAGER.type, destination: SEA_VOYAGER.destination, weather: SEA_VOYAGER.weather, weatherIcon: SEA_VOYAGER.weatherIcon, quantity: "2,400 MT", status: "ARRIVED", statusColor: "text-indigo-400 bg-indigo-400/10" },
];

export const maintenanceLogs = [
  { id: "AE-741-B", category: "Freighter", task: "Thruster Realignment", date: "2024.08.14", status: "COMPLETED", statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { id: "AE-112-L", category: "Tug", task: `Repair ${OCEAN_STAR.failure}`, date: "2024.08.12", status: "CRITICAL", statusColor: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
];

export const fuelAnalyticsData = [
  { name: NEON_HORIZON.name, id: `ID: ${NEON_HORIZON.id}`, fuel: NEON_HORIZON.fuel, fuelText: NEON_HORIZON.fuelText, rate: "12.8 MT/DAY", dist: "3,120 NM", score: "96.5 / HIGH", color: NEON_HORIZON.color },
  { name: OCEAN_STAR.name, id: `ID: ${OCEAN_STAR.id}`, fuel: OCEAN_STAR.fuel, fuelText: OCEAN_STAR.fuelText, rate: "19.2 MT/DAY", dist: "850 NM", score: "68.2 / LOW", color: OCEAN_STAR.color },
];

export const alerts = [
  { type: "CRITICAL", title: "Engine Failure", time: "04:12 WIB", desc: `MV ${OCEAN_STAR.name} reports ${OCEAN_STAR.failure}.`, color: "rose" },
  { type: "WARNING", title: "Weather Warning", time: "02:45 WIB", desc: "Cyclone approaching Sector 7G.", color: "purple" },
];

export const chartData = [85, 28, 62, 91, 45]; 
export const chartLabels = ["NEON", "STAR", "VOYAGER", "GALE", "DRIFT"];

export const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: 'password123',
  },
];

export const customers = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Dummy Customer',
    email: 'dummy@customer.com',
    image_url: '/customers/dummy.png',
  },
];

export const invoices = [
  {
    customer_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    amount: 1000,
    status: 'pending',
    date: '2022-12-06',
  },
];

export const revenue = [
  { month: 'Jan', revenue: 2000 },
];