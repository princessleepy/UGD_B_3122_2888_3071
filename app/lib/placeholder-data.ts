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

const TITAN_WAVE = {
  id: "20060066",
  name: "TITAN WAVE",
  status: "EN ROUTE",
  statusColor: "text-emerald-500",
  location: "Makassar Port",
  destination: "TOKYO [HND]",
  speed: "16.7 KN",
  fuel: 74.3,
  fuelText: "NOMINAL",
  eta: "2024.05.25 / 07:15",
  type: "AUTOMOTIVE",
  weather: "CLEAR",
  weatherIcon: "☀️",
  score: 90.2,
  update: "8M AGO",
  progress: 72,
  color: "bg-cyan-400"
};

const BLACK_PEARL = {
  id: "20070077",
  name: "BLACK PEARL",
  status: "ANCHORAGE",
  statusColor: "text-amber-500",
  location: "Batam Port",
  destination: "DUBAI [DXB]",
  speed: "2.3 KN",
  fuel: 51.2,
  fuelText: "NOMINAL",
  eta: "2024.05.26 / 10:00",
  type: "OIL",
  weather: "WINDY",
  weatherIcon: "🌬️",
  score: 82.4,
  update: "15M AGO",
  progress: 88,
  color: "bg-amber-400"
};

const STORM_CHASER = {
  id: "20080088",
  name: "STORM CHASER",
  status: "MAINTENANCE",
  statusColor: "text-rose-500",
  location: "Bali Port",
  destination: "BUSAN [PUS]",
  speed: "0.0 KN",
  fuel: 21.5,
  fuelText: "LOW",
  eta: "---",
  type: "CONTAINER",
  weather: "STORM",
  weatherIcon: "⛈️",
  score: 61.3,
  update: "20M AGO",
  progress: 33,
  failure: "ENGINE CORE",
  temp: "97°C",
  color: "bg-rose-500"
};

const BLUE_LEVIATHAN = {
  id: "20090099",
  name: "BLUE LEVIATHAN",
  status: "IN PORT",
  statusColor: "text-indigo-500",
  location: "Semarang Port",
  destination: "HONG KONG [HKG]",
  speed: "0.4 KN",
  fuel: 69.8,
  fuelText: "GOOD",
  eta: "2024.05.27 / 09:45",
  type: "CHEMICAL",
  weather: "FOGGY",
  weatherIcon: "🌫️",
  score: 91.8,
  update: "6M AGO",
  progress: 20,
  color: "bg-indigo-400"
};

const IRON_TITAN = {
  id: "20100100",
  name: "IRON TITAN",
  status: "EN ROUTE",
  statusColor: "text-emerald-500",
  location: "Aceh Port",
  destination: "MANILA [MNL]",
  speed: "20.1 KN",
  fuel: 95.1,
  fuelText: "FULL",
  eta: "2024.05.28 / 13:00",
  type: "HEAVY EQUIPMENT",
  weather: "CLEAR",
  weatherIcon: "☀️",
  score: 97.1,
  update: "1M AGO",
  progress: 81,
  color: "bg-emerald-400"
};

const SHADOW_CRUISER = {
  id: "20110111",
  name: "SHADOW CRUISER",
  status: "EN ROUTE",
  statusColor: "text-emerald-500",
  location: "Papua Port",
  destination: "SEOUL [ICN]",
  speed: "17.4 KN",
  fuel: 88.6,
  fuelText: "GOOD",
  eta: "2024.05.29 / 06:20",
  type: "TECH EQUIPMENT",
  weather: "CLEAR",
  weatherIcon: "☀️",
  score: 94.3,
  update: "3M AGO",
  progress: 77,
  color: "bg-violet-400"
};

const GOLDEN_FALCON = {
  id: "20120222",
  name: "GOLDEN FALCON",
  status: "ANCHORAGE",
  statusColor: "text-amber-500",
  location: "Lampung Port",
  destination: "BANGKOK [BKK]",
  speed: "3.5 KN",
  fuel: 57.9,
  fuelText: "NOMINAL",
  eta: "2024.05.30 / 15:40",
  type: "FOOD SUPPLY",
  weather: "CLOUDY",
  weatherIcon: "☁️",
  score: 86.9,
  update: "9M AGO",
  progress: 90,
  color: "bg-yellow-400"
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
  { name: TITAN_WAVE.name, location: TITAN_WAVE.location, eta: TITAN_WAVE.eta, status: TITAN_WAVE.status, statusColor: TITAN_WAVE.statusColor, update: TITAN_WAVE.update },
  { name: BLACK_PEARL.name, location: BLACK_PEARL.location, eta: BLACK_PEARL.eta, status: BLACK_PEARL.status, statusColor: BLACK_PEARL.statusColor, update: BLACK_PEARL.update },
  { name: STORM_CHASER.name, location: STORM_CHASER.location, eta: STORM_CHASER.eta, status: STORM_CHASER.status, statusColor: STORM_CHASER.statusColor, update: STORM_CHASER.update },
  { name: BLUE_LEVIATHAN.name, location: BLUE_LEVIATHAN.location, eta: BLUE_LEVIATHAN.eta, status: BLUE_LEVIATHAN.status, statusColor: BLUE_LEVIATHAN.statusColor, update: BLUE_LEVIATHAN.update },
  { name: IRON_TITAN.name, location: IRON_TITAN.location, eta: IRON_TITAN.eta, status: IRON_TITAN.status, statusColor: IRON_TITAN.statusColor, update: IRON_TITAN.update },
  { name: SHADOW_CRUISER.name, location: SHADOW_CRUISER.location, eta: SHADOW_CRUISER.eta, status: SHADOW_CRUISER.status, statusColor: SHADOW_CRUISER.statusColor, update: SHADOW_CRUISER.update },
  { name: GOLDEN_FALCON.name, location: GOLDEN_FALCON.location, eta: GOLDEN_FALCON.eta, status: GOLDEN_FALCON.status, statusColor: GOLDEN_FALCON.statusColor, update: GOLDEN_FALCON.update },
];

export const maintenanceData = [
  { name: NEON_HORIZON.name, progress: NEON_HORIZON.progress, eta: "READY", status: "ACTIVE", engineEff: "94%", nextService: "12 DAYS" },
  { name: OCEAN_STAR.name, progress: OCEAN_STAR.progress, eta: "45H", status: "CRITICAL", failure: OCEAN_STAR.failure, temp: OCEAN_STAR.temp },
  { name: SEA_VOYAGER.name, progress: SEA_VOYAGER.progress, eta: "120H", status: "PLANNED", hullInspect: "PENDING", location: SEA_VOYAGER.location },
  { name: ARCTIC_GALE.name, progress: ARCTIC_GALE.progress, eta: "READY", status: "ACTIVE", engineEff: "91%", nextService: "18 DAYS" },
  { name: PACIFIC_DRIFT.name, progress: PACIFIC_DRIFT.progress, eta: "READY", status: "ACTIVE", engineEff: "88%", nextService: "09 DAYS" },
  { name: TITAN_WAVE.name, progress: TITAN_WAVE.progress, eta: "72H", status: "ACTIVE", engineEff: "90%", nextService: "15 DAYS" },
  { name: BLACK_PEARL.name, progress: BLACK_PEARL.progress, eta: "96H", status: "PLANNED", hullInspect: "SCHEDULED", location: BLACK_PEARL.location },
  { name: STORM_CHASER.name, progress: STORM_CHASER.progress, eta: "60H", status: "CRITICAL", failure: STORM_CHASER.failure, temp: STORM_CHASER.temp },
  { name: BLUE_LEVIATHAN.name, progress: BLUE_LEVIATHAN.progress, eta: "108H", status: "PLANNED", hullInspect: "PENDING", location: BLUE_LEVIATHAN.location },
  { name: IRON_TITAN.name, progress: IRON_TITAN.progress, eta: "READY", status: "ACTIVE", engineEff: "97%", nextService: "21 DAYS" },
  { name: SHADOW_CRUISER.name, progress: SHADOW_CRUISER.progress, eta: "READY", status: "ACTIVE", engineEff: "95%", nextService: "17 DAYS" },
  { name: GOLDEN_FALCON.name, progress: GOLDEN_FALCON.progress, eta: "84H", status: "ACTIVE", engineEff: "87%", nextService: "10 DAYS" },
];

export const mapVesselData = [
  { id: NEON_HORIZON.id, name: NEON_HORIZON.name, status: NEON_HORIZON.status, statusColor: NEON_HORIZON.statusColor, speed: NEON_HORIZON.speed, destination: NEON_HORIZON.destination },
  { id: OCEAN_STAR.id, name: OCEAN_STAR.name, status: OCEAN_STAR.status, statusColor: OCEAN_STAR.statusColor, speed: OCEAN_STAR.speed, destination: OCEAN_STAR.destination },
  { id: SEA_VOYAGER.id, name: SEA_VOYAGER.name, status: SEA_VOYAGER.status, statusColor: SEA_VOYAGER.statusColor, speed: SEA_VOYAGER.speed, destination: SEA_VOYAGER.destination },
  { id: ARCTIC_GALE.id, name: ARCTIC_GALE.name, status: ARCTIC_GALE.status, statusColor: ARCTIC_GALE.statusColor, speed: ARCTIC_GALE.speed, destination: ARCTIC_GALE.destination },
  { id: PACIFIC_DRIFT.id, name: PACIFIC_DRIFT.name, status: PACIFIC_DRIFT.status, statusColor: PACIFIC_DRIFT.statusColor, speed: PACIFIC_DRIFT.speed, destination: PACIFIC_DRIFT.destination },
  { id: TITAN_WAVE.id, name: TITAN_WAVE.name, status: TITAN_WAVE.status, statusColor: TITAN_WAVE.statusColor, speed: TITAN_WAVE.speed, destination: TITAN_WAVE.destination },

{ id: BLACK_PEARL.id, name: BLACK_PEARL.name, status: BLACK_PEARL.status, statusColor: BLACK_PEARL.statusColor, speed: BLACK_PEARL.speed, destination: BLACK_PEARL.destination },
{ id: STORM_CHASER.id, name: STORM_CHASER.name, status: STORM_CHASER.status, statusColor: STORM_CHASER.statusColor, speed: STORM_CHASER.speed, destination: STORM_CHASER.destination },
{ id: BLUE_LEVIATHAN.id, name: BLUE_LEVIATHAN.name, status: BLUE_LEVIATHAN.status, statusColor: BLUE_LEVIATHAN.statusColor, speed: BLUE_LEVIATHAN.speed, destination: BLUE_LEVIATHAN.destination },
{ id: IRON_TITAN.id, name: IRON_TITAN.name, status: IRON_TITAN.status, statusColor: IRON_TITAN.statusColor, speed: IRON_TITAN.speed, destination: IRON_TITAN.destination },
{ id: SHADOW_CRUISER.id, name: SHADOW_CRUISER.name, status: SHADOW_CRUISER.status, statusColor: SHADOW_CRUISER.statusColor, speed: SHADOW_CRUISER.speed, destination: SHADOW_CRUISER.destination },

{ id: GOLDEN_FALCON.id, name: GOLDEN_FALCON.name, status: GOLDEN_FALCON.status, statusColor: GOLDEN_FALCON.statusColor, speed: GOLDEN_FALCON.speed, destination: GOLDEN_FALCON.destination },
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
  { name: SEA_VOYAGER.name, id: `ID: ${SEA_VOYAGER.id}`, fuel: SEA_VOYAGER.fuel, fuelText: SEA_VOYAGER.fuelText, rate: "14.5 MT/DAY", dist: "4,210 NM", score: "92.1 / OPTIMAL", color: SEA_VOYAGER.color },
  { name: ARCTIC_GALE.name, id: `ID: ${ARCTIC_GALE.id}`, fuel: ARCTIC_GALE.fuel, fuelText: ARCTIC_GALE.fuelText, rate: "16.0 MT/DAY", dist: "1,204 NM", score: "89.4 / OPTIMAL", color: ARCTIC_GALE.color },
  { name: PACIFIC_DRIFT.name, id: `ID: ${PACIFIC_DRIFT.id}`, fuel: PACIFIC_DRIFT.fuel, fuelText: PACIFIC_DRIFT.fuelText, rate: "13.2 MT/DAY", dist: "2,150 NM", score: "84.7 / STABLE", color: PACIFIC_DRIFT.color },
  { name: TITAN_WAVE.name, id: `ID: ${TITAN_WAVE.id}`, fuel: TITAN_WAVE.fuel, fuelText: TITAN_WAVE.fuelText, rate: "15.7 MT/DAY", dist: "3,880 NM", score: "90.2 / OPTIMAL", color: TITAN_WAVE.color },
  { name: BLACK_PEARL.name, id: `ID: ${BLACK_PEARL.id}`, fuel: BLACK_PEARL.fuel, fuelText: BLACK_PEARL.fuelText, rate: "17.4 MT/DAY", dist: "2,640 NM", score: "82.4 / STABLE", color: BLACK_PEARL.color },
  { name: STORM_CHASER.name, id: `ID: ${STORM_CHASER.id}`, fuel: STORM_CHASER.fuel, fuelText: STORM_CHASER.fuelText, rate: "21.8 MT/DAY", dist: "540 NM", score: "61.3 / LOW", color: STORM_CHASER.color },
  { name: BLUE_LEVIATHAN.name, id: `ID: ${BLUE_LEVIATHAN.id}`, fuel: BLUE_LEVIATHAN.fuel, fuelText: BLUE_LEVIATHAN.fuelText, rate: "13.9 MT/DAY", dist: "3,010 NM", score: "91.8 / OPTIMAL", color: BLUE_LEVIATHAN.color },
  { name: IRON_TITAN.name, id: `ID: ${IRON_TITAN.id}`, fuel: IRON_TITAN.fuel, fuelText: IRON_TITAN.fuelText, rate: "18.1 MT/DAY", dist: "4,620 NM", score: "97.1 / HIGH", color: IRON_TITAN.color },
  { name: SHADOW_CRUISER.name, id: `ID: ${SHADOW_CRUISER.id}`, fuel: SHADOW_CRUISER.fuel, fuelText: SHADOW_CRUISER.fuelText, rate: "14.9 MT/DAY", dist: "2,920 NM", score: "94.3 / HIGH", color: SHADOW_CRUISER.color },
  { name: GOLDEN_FALCON.name, id: `ID: ${GOLDEN_FALCON.id}`, fuel: GOLDEN_FALCON.fuel, fuelText: GOLDEN_FALCON.fuelText, rate: "12.6 MT/DAY", dist: "1,760 NM", score: "86.9 / STABLE", color: GOLDEN_FALCON.color },
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