import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  ShipmentTransaction,
  ShipmentTransactionForm,
  Vehicle,
  VehicleForm,
} from './definitions';
import { formatCurrency } from './utils';
import { sql } from '@/app/lib/db';

// ==================== REVENUE ====================

export async function fetchRevenue() {
  try {
    const data = await sql`SELECT * FROM revenue`;
    return data as unknown as Revenue[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// ==================== INVOICES ====================

export async function fetchLatestInvoices() {
  try {
    const data = await sql`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = (data as any[]).map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`
      SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
      FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number((data[0] as any)[0].count ?? '0');
    const numberOfCustomers = Number((data[1] as any)[0].count ?? '0');
    const totalPaidInvoices = formatCurrency((data[2] as any)[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency((data[2] as any)[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      numberOfCustomers: 0,
      numberOfInvoices: 0,
      totalPaidInvoices: '$0',
      totalPendingInvoices: '$0',
    };
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql`
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

    return invoices as unknown as InvoicesTable[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number((data as any)[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    return 1;
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = (data as any[]).map((invoice) => ({
      ...invoice,
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

// ==================== CUSTOMERS ====================

export async function fetchCustomers() {
  try {
    const customers = await sql`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers as unknown as CustomerField[];
  } catch (err) {
    console.error('Database Error:', err);
    return [];
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql`
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

    const customers = (data as any[]).map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    return [];
  }
}

// ==================== SHIPMENTS ====================

const SHIPMENTS_PER_PAGE = 5;

export async function fetchFilteredShipmentTransactions(
  query: string = '',
  status: string = '',
  currentPage: number = 1,
) {
  const offset = (currentPage - 1) * SHIPMENTS_PER_PAGE;
  try {
    let result;
    if (status && status !== 'ALL') {
      result = await sql`
        SELECT * FROM shipment_transactions 
        WHERE (
          tracking_number ILIKE ${`%${query}%`} OR
          sender_name ILIKE ${`%${query}%`} OR
          receiver_name ILIKE ${`%${query}%`} OR
          item_name ILIKE ${`%${query}%`} OR
          item_type ILIKE ${`%${query}%`} OR
          origin_city ILIKE ${`%${query}%`} OR
          destination_city ILIKE ${`%${query}%`}
        ) AND shipment_status = ${status}
        ORDER BY created_at DESC
        LIMIT ${SHIPMENTS_PER_PAGE} OFFSET ${offset}
      `;
    } else {
      result = await sql`
        SELECT * FROM shipment_transactions 
        WHERE (
          tracking_number ILIKE ${`%${query}%`} OR
          sender_name ILIKE ${`%${query}%`} OR
          receiver_name ILIKE ${`%${query}%`} OR
          item_name ILIKE ${`%${query}%`} OR
          item_type ILIKE ${`%${query}%`} OR
          origin_city ILIKE ${`%${query}%`} OR
          destination_city ILIKE ${`%${query}%`}
        )
        ORDER BY created_at DESC
        LIMIT ${SHIPMENTS_PER_PAGE} OFFSET ${offset}
      `;
    }
    return (result as any[]) || [];
  } catch (error) {
    console.error('Error in fetchFilteredShipmentTransactions:', error);
    return [];
  }
}

export async function fetchShipmentTransactionPages(query: string = '', status: string = '') {
  try {
    let data;
    if (status && status !== 'ALL') {
      data = await sql`
        SELECT COUNT(*)
        FROM shipment_transactions
        WHERE (
          tracking_number ILIKE ${`%${query}%`} OR
          sender_name ILIKE ${`%${query}%`} OR
          receiver_name ILIKE ${`%${query}%`} OR
          item_name ILIKE ${`%${query}%`} OR
          item_type ILIKE ${`%${query}%`} OR
          origin_city ILIKE ${`%${query}%`} OR
          destination_city ILIKE ${`%${query}%`}
        ) AND shipment_status = ${status}
      `;
    } else {
      data = await sql`
        SELECT COUNT(*)
        FROM shipment_transactions
        WHERE
          tracking_number ILIKE ${`%${query}%`} OR
          sender_name ILIKE ${`%${query}%`} OR
          receiver_name ILIKE ${`%${query}%`} OR
          item_name ILIKE ${`%${query}%`} OR
          item_type ILIKE ${`%${query}%`} OR
          origin_city ILIKE ${`%${query}%`} OR
          destination_city ILIKE ${`%${query}%`}
      `;
    }

    return Math.ceil(Number((data as any)[0].count) / SHIPMENTS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    return 1;
  }
}

export async function fetchShipmentTransactionById(id: string) {
  try {
    const data = await sql`
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

    return (data as any[])[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

// ==================== VEHICLES ====================

const VEHICLES_PER_PAGE = 6;

export async function fetchFilteredVehicles(
  query: string,
  status: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * VEHICLES_PER_PAGE;

  try {
    const allVehicles = await sql`
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
      ORDER BY created_at DESC
    `;

    let vehicles = allVehicles as any[];

    if (query) {
      const queryLower = query.toLowerCase();
      vehicles = vehicles.filter((v) =>
        v.vehicle_code.toLowerCase().includes(queryLower) ||
        v.vehicle_name.toLowerCase().includes(queryLower) ||
        v.vehicle_type.toLowerCase().includes(queryLower) ||
        (v.capacity && v.capacity.toLowerCase().includes(queryLower))
      );
    }

    if (status && status !== 'ALL') {
      vehicles = vehicles.filter((v) => v.status === status);
    }

    const paginatedVehicles = vehicles.slice(offset, offset + VEHICLES_PER_PAGE);

    return paginatedVehicles as Vehicle[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchVehiclePages(query: string, status: string) {
  try {
    const allVehicles = await sql`
      SELECT id, vehicle_code, vehicle_name, vehicle_type, capacity, status
      FROM vehicles
    `;

    let vehicles = allVehicles as any[];

    if (query) {
      const queryLower = query.toLowerCase();
      vehicles = vehicles.filter((v) =>
        v.vehicle_code.toLowerCase().includes(queryLower) ||
        v.vehicle_name.toLowerCase().includes(queryLower) ||
        v.vehicle_type.toLowerCase().includes(queryLower) ||
        (v.capacity && v.capacity.toLowerCase().includes(queryLower))
      );
    }

    if (status && status !== 'ALL') {
      vehicles = vehicles.filter((v) => v.status === status);
    }

    const totalPages = Math.ceil(vehicles.length / VEHICLES_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    return 1;
  }
}

export async function fetchVehicleById(id: string) {
  try {
    const data = await sql`
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

    return (data as any[])[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

// ==================== DASHBOARD & FLEET ====================

export async function fetchAllVehicles() {
  try {
    const vehicles = await sql`
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
      ORDER BY vehicle_name ASC
    `;
    return vehicles as unknown as Vehicle[];
  } catch (error) {
    console.error('Error fetching all vehicles:', error);
    return [];
  }
}

export async function fetchVehiclesByStatus(status: string) {
  try {
    const result = await sql`
      SELECT
        id, vehicle_code, vehicle_name, vehicle_type,
        capacity, status, status_color, registry_status, hull_integrity, created_at
      FROM vehicles
      WHERE status = ${status}
      ORDER BY vehicle_name ASC
    `;
    return (result as unknown as Vehicle[]) || [];
  } catch (error) {
    console.error('Error fetching vehicles by status:', error);
    return [];
  }
}

export async function getFleetStats() {
  try {
    const vehicles = await sql`SELECT status FROM vehicles`;
    const allVehicles = vehicles as any[];

    const total = allVehicles.length;
    const en_route = allVehicles.filter((v) => v.status === 'EN ROUTE').length;
    const in_port = allVehicles.filter((v) => v.status === 'IN PORT').length;
    const anchorage = allVehicles.filter((v) => v.status === 'ANCHORAGE').length;
    const maintenance = allVehicles.filter((v) => v.status === 'MAINTENANCE').length;
    
    const readiness = total > 0 
      ? parseFloat(((total - maintenance) / total * 100).toFixed(1))
      : 0;

    return {
      total,
      en_route,
      in_port,
      anchorage,
      maintenance,
      readiness
    };
  } catch (error) {
    console.error('Error fetching fleet stats:', error);
    return {
      total: 0,
      en_route: 0,
      in_port: 0,
      anchorage: 0,
      maintenance: 0,
      readiness: 0
    };
  }
}

export async function fetchAvailableVehicles(excludeStatus: string = 'MAINTENANCE') {
  try {
    const result = await sql`
      SELECT id, vehicle_name, vehicle_code, vehicle_type, capacity, status
      FROM vehicles
      WHERE status != ${excludeStatus}
      ORDER BY vehicle_name ASC
    `;
    return (result as any[]) || [];
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    return [];
  }
}