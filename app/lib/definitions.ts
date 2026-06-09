// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ShipmentTransaction = {
  id: string;
  tracking_number: string;
  shipping_date: string;
  sender_name: string;
  receiver_name: string;
  phone_number: string;
  origin_city: string;
  destination_city: string;
  item_name: string;
  item_type: string;
  item_weight: number;
  price: number;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_code: string;
  vehicle_capacity: string;
  vehicle_status: string;
  shipping_type: string;
  shipment_status: string;
  notes: string | null;
  created_at: string;
};

export type ShipmentTransactionForm = Omit<
  ShipmentTransaction,
  'created_at'
>;

//vehicle
export type Vehicle = {
  id: string;
  vehicle_code: string;
  vehicle_name: string;
  vehicle_type: string;
  capacity: string;
  status: string;
  status_color: string;
  registry_status: string;
  hull_integrity: string;
  created_at: string;
  updated_at?: string;
};

export type VehicleForm = Omit<Vehicle, 'created_at' | 'updated_at'>;

export type VehicleStats = {
  total: number;
  enRoute: number;
  inPort: number;
  anchorage: number;
  maintenance: number;
  readiness: string;
};

export type MapVessel = {
  vehicle_code: string;
  vehicle_name: string;
  status: string;
  velocity: string;
  heading: string;
};

export type VesselAuditRow = Vehicle & {
  fuel_percentage: number;
  consumption_rate: number;
  voyage_distance: number;
  efficiency_score: number;
};

export type PerformanceVessel = {
  vehicle_name: string;
  vehicle_code: string;
  performance: number;
  avg_speed: number;
  status: string;
};