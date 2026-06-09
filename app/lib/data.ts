import { sql } from './db';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  MapVessel,
  PerformanceVessel,
  Revenue,
  ShipmentTransaction,
  ShipmentTransactionForm,
  Vehicle,
  VehicleForm,
  VehicleStats,
  VesselAuditRow,
} from './definitions';
import {
  formatCurrency,
  getMockEfficiency,
  timeAgo,
} from './utils';

export {
  timeAgo,
  buildStatusDistribution,
  getVehicleLocation,
  getVehicleEta,
} from './utils';



export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

const SHIPMENTS_PER_PAGE = 5;

export async function fetchFilteredShipmentTransactions(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * SHIPMENTS_PER_PAGE;

  try {
    const shipments = await sql<ShipmentTransaction[]>`
      SELECT
        id,
        tracking_number,
        shipping_date,
        sender_name,
        receiver_name,
        phone_number,
        origin_city,
        destination_city,
        item_name,
        item_type,
        item_weight,
        price,
        vehicle_name,
        vehicle_type,
        vehicle_code,
        vehicle_capacity,
        vehicle_status,
        shipping_type,
        shipment_status,
        notes,
        created_at
      FROM shipment_transactions
      WHERE
        tracking_number ILIKE ${`%${query}%`} OR
        sender_name ILIKE ${`%${query}%`} OR
        receiver_name ILIKE ${`%${query}%`} OR
        item_name ILIKE ${`%${query}%`} OR
        item_type ILIKE ${`%${query}%`} OR
        origin_city ILIKE ${`%${query}%`} OR
        destination_city ILIKE ${`%${query}%`} OR
        shipment_status ILIKE ${`%${query}%`}
      ORDER BY created_at DESC
      LIMIT ${SHIPMENTS_PER_PAGE} OFFSET ${offset}
    `;

    return shipments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch shipment transactions.');
  }
}

export async function fetchShipmentTransactionPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM shipment_transactions
      WHERE
        tracking_number ILIKE ${`%${query}%`} OR
        sender_name ILIKE ${`%${query}%`} OR
        receiver_name ILIKE ${`%${query}%`} OR
        item_name ILIKE ${`%${query}%`} OR
        item_type ILIKE ${`%${query}%`} OR
        origin_city ILIKE ${`%${query}%`} OR
        destination_city ILIKE ${`%${query}%`} OR
        shipment_status ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(data[0].count) / SHIPMENTS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch shipment pages.');
  }
}

//tambahan
export async function fetchShipmentTransactionById(id: string) {
  try {
    const data = await sql<ShipmentTransactionForm[]>`
      SELECT
        id,
        tracking_number,
        shipping_date,
        sender_name,
        receiver_name,
        phone_number,
        origin_city,
        destination_city,
        item_name,
        item_type,
        item_weight,
        price,
        vehicle_name,
        vehicle_type,
        vehicle_code,
        vehicle_capacity,
        vehicle_status,
        shipping_type,
        shipment_status,
        notes
      FROM shipment_transactions
      WHERE id = ${id}
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch shipment transaction.');
  }
}

const VEHICLES_PER_PAGE = 6;

export async function fetchFilteredVehicles(
  query: string,
  status: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * VEHICLES_PER_PAGE;

  try {
    const vehicles = await sql<Vehicle[]>`
      SELECT
        id,
        vehicle_code,
        vehicle_name,
        vehicle_type,
        capacity,
        status,
        status_color,
        registry_status,
        hull_integrity,
        created_at
      FROM vehicles
      WHERE
        (
          vehicle_code ILIKE ${`%${query}%`} OR
          vehicle_name ILIKE ${`%${query}%`} OR
          vehicle_type ILIKE ${`%${query}%`} OR
          capacity ILIKE ${`%${query}%`}
        )
        AND (
          ${status} = 'ALL' OR status = ${status}
        )
      ORDER BY created_at DESC
      LIMIT ${VEHICLES_PER_PAGE} OFFSET ${offset}
    `;

    return vehicles;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicles.');
  }
}

export async function fetchVehiclePages(query: string, status: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM vehicles
      WHERE
        (
          vehicle_code ILIKE ${`%${query}%`} OR
          vehicle_name ILIKE ${`%${query}%`} OR
          vehicle_type ILIKE ${`%${query}%`} OR
          capacity ILIKE ${`%${query}%`}
        )
        AND (
          ${status} = 'ALL' OR status = ${status}
        )
    `;

    return Math.ceil(Number(data[0].count) / VEHICLES_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicle pages.');
  }
}

//vehicle
export async function fetchVehicleById(id: string) {
  try {
    const data = await sql<VehicleForm[]>`
      SELECT
        id,
        vehicle_code,
        vehicle_name,
        vehicle_type,
        capacity,
        status,
        status_color,
        registry_status,
        hull_integrity
      FROM vehicles
      WHERE id = ${id}
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vehicle.');
  }
}

//dashboard

export async function fetchVehicleStats(): Promise<VehicleStats> {
  try {
    const vehicles = await sql<{ status: string }[]>`
      SELECT status FROM vehicles
    `;
    const total = vehicles.length;
    const enRoute = vehicles.filter((v) => v.status === 'EN ROUTE').length;
    const inPort = vehicles.filter((v) => v.status === 'IN PORT').length;
    const anchorage = vehicles.filter((v) => v.status === 'ANCHORAGE').length;
    const maintenance = vehicles.filter((v) => v.status === 'MAINTENANCE').length;
    const readiness =
      total > 0 ? (((total - maintenance) / total) * 100).toFixed(1) : '0';

    return { total, enRoute, inPort, anchorage, maintenance, readiness };
  } catch (error) {
    console.error('Error fetching vehicle stats:', error);
    return {
      total: 0,
      enRoute: 0,
      inPort: 0,
      anchorage: 0,
      maintenance: 0,
      readiness: '0',
    };
  }
}

export async function fetchAllVehicles(): Promise<Vehicle[]> {
  try {
    const vehicles = await sql<Vehicle[]>`
      SELECT * FROM vehicles ORDER BY vehicle_name
    `;
    return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Propagate error to be handled by the calling component
      throw new Error('Failed to fetch all vehicles');
    }
}

export async function fetchMaintenanceVessels() {
  try {
    const vessels = await sql<
      Pick<Vehicle, 'vehicle_name' | 'vehicle_code' | 'status' | 'updated_at'>[]
    >`
      SELECT vehicle_name, vehicle_code, status, updated_at
      FROM vehicles
      WHERE status = 'MAINTENANCE'
      ORDER BY updated_at DESC
    `;
    return vessels;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch maintenance vessels.');
  }
}

export async function fetchVesselsForMap() {
  try {
    const vessels = await sql<MapVessel[]>`
      SELECT
        vehicle_code,
        vehicle_name,
        status,
        CASE
          WHEN status = 'EN ROUTE' THEN '14.2 KN'
          ELSE '0.0 KN'
        END as velocity,
        CASE
          WHEN status = 'EN ROUTE' THEN 'SINGAPORE [SIN]'
          WHEN status = 'IN PORT' THEN 'JAKARTA [JKT]'
          ELSE 'ANCHORAGE'
        END as heading
      FROM vehicles
      ORDER BY vehicle_name
      LIMIT 6
    `;
    return vessels;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vessels for map.');
  }
}

export async function fetchAvailableVehicles() {
  try {
    const vehicles = await sql<
      Pick<
        Vehicle,
        'vehicle_code' | 'vehicle_name' | 'vehicle_type' | 'capacity' | 'status'
      >[]
    >`
      SELECT vehicle_code, vehicle_name, vehicle_type, capacity, status
      FROM vehicles
      WHERE status != 'MAINTENANCE'
      ORDER BY vehicle_name
    `;
    return vehicles;
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    return [];
  }
}

export async function fetchVesselAudit(): Promise<VesselAuditRow[]> {
  try {
    const vessels = await sql<Vehicle[]>`
      SELECT * FROM vehicles ORDER BY vehicle_name
    `;

    return vessels.map((vessel) => ({
      ...vessel,
      fuel_percentage:
        vessel.status === 'EN ROUTE'
          ? 85
          : vessel.status === 'MAINTENANCE'
            ? 30
            : 60,
      consumption_rate: vessel.vehicle_type.includes('CARGO') ? 15 : 10,
      voyage_distance: vessel.status === 'EN ROUTE' ? 3000 : 0,
      efficiency_score: getMockEfficiency(vessel.status, vessel.vehicle_code),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vessel audit data.');
  }
}

export async function fetchTopVesselScores(limit = 4) {
  try {
    const vessels = await sql<
      { vehicle_name: string; efficiency_score: number }[]
    >`
      SELECT
        vehicle_name,
        CASE
          WHEN status = 'MAINTENANCE' THEN 40
          ELSE 85 + (RANDOM() * 15)
        END as efficiency_score
      FROM vehicles
      WHERE status != 'MAINTENANCE'
      ORDER BY efficiency_score DESC
      LIMIT ${limit}
    `;
    return vessels;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch top vessel scores.');
  }
}

export async function fetchPerformanceVessels(
  currentPage = 1,
  perPage = 5,
): Promise<{ vessels: PerformanceVessel[]; total: number }> {
  const offset = (currentPage - 1) * perPage;

  try {
    const vessels = await sql<PerformanceVessel[]>`
      SELECT
        vehicle_name,
        vehicle_code,
        CASE
          WHEN status = 'MAINTENANCE' THEN 40
          WHEN status = 'EN ROUTE' THEN 90 + (RANDOM() * 10)
          ELSE 75 + (RANDOM() * 15)
        END as performance,
        CASE
          WHEN status = 'EN ROUTE' THEN 15.0
          ELSE 0.0
        END as avg_speed,
        CASE
          WHEN status = 'MAINTENANCE' THEN 'LOW'
          WHEN status = 'EN ROUTE' THEN 'OPTIMAL'
          ELSE 'STABLE'
        END as status
      FROM vehicles
      ORDER BY performance DESC
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const total = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int as count FROM vehicles
    `;

    return { vessels, total: total[0]?.count ?? 0 };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch performance vessels.');
  }
}

export async function fetchTotalVehicleCount(): Promise<number> {
  try {
    const result = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int as count FROM vehicles
    `;
    return result[0]?.count ?? 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total vehicle count.');
  }
}

