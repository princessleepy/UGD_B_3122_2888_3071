'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ShipmentSchema = z.object({
  shippingDate: z.string(),
  senderName: z.string().min(1),
  receiverName: z.string().min(1),
  phoneNumber: z.string().min(1),
  originCity: z.string().min(1),
  destinationCity: z.string().min(1),
  itemName: z.string().min(1),
  itemType: z.string().min(1),
  itemWeight: z.coerce.number().gt(0),
  price: z.coerce.number().gt(0),
  vehicleName: z.string().min(1),
  vehicleType: z.string().min(1),
  vehicleCode: z.string().min(1),
  vehicleCapacity: z.string().min(1),
  vehicleStatus: z.string().min(1),
  shippingType: z.string().min(1),
  shipmentStatus: z.string().min(1),
  notes: z.string().optional(),
});

function generateTrackingNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const unique = Date.now().toString().slice(-6);

  return `STN-${year}-${unique}`;
}

export async function createShipmentTransaction(formData: FormData) {
  const validatedFields = ShipmentSchema.parse({
    shippingDate: formData.get('shippingDate'),
    senderName: formData.get('senderName'),
    receiverName: formData.get('receiverName'),
    phoneNumber: formData.get('phoneNumber'),
    originCity: formData.get('originCity'),
    destinationCity: formData.get('destinationCity'),
    itemName: formData.get('itemName'),
    itemType: formData.get('itemType'),
    itemWeight: formData.get('itemWeight'),
    price: formData.get('price'),
    vehicleName: formData.get('vehicleName'),
    vehicleType: formData.get('vehicleType'),
    vehicleCode: formData.get('vehicleCode'),
    vehicleCapacity: formData.get('vehicleCapacity'),
    vehicleStatus: formData.get('vehicleStatus'),
    shippingType: formData.get('shippingType'),
    shipmentStatus: formData.get('shipmentStatus'),
    notes: formData.get('notes'),
  });

  const trackingNumber = generateTrackingNumber();

  await sql`
    INSERT INTO shipment_transactions (
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
    )
    VALUES (
      ${trackingNumber},
      ${validatedFields.shippingDate},
      ${validatedFields.senderName},
      ${validatedFields.receiverName},
      ${validatedFields.phoneNumber},
      ${validatedFields.originCity},
      ${validatedFields.destinationCity},
      ${validatedFields.itemName},
      ${validatedFields.itemType},
      ${validatedFields.itemWeight},
      ${validatedFields.price},
      ${validatedFields.vehicleName},
      ${validatedFields.vehicleType},
      ${validatedFields.vehicleCode},
      ${validatedFields.vehicleCapacity},
      ${validatedFields.vehicleStatus},
      ${validatedFields.shippingType},
      ${validatedFields.shipmentStatus},
      ${validatedFields.notes || null}
    )
  `;

  revalidatePath('/dashboard/map/shipments');
  redirect('/dashboard/map/shipments');
}

export async function updateShipmentTransaction(
  id: string,
  formData: FormData,
) {
  const validatedFields = ShipmentSchema.parse({
    shippingDate: formData.get('shippingDate'),
    senderName: formData.get('senderName'),
    receiverName: formData.get('receiverName'),
    phoneNumber: formData.get('phoneNumber'),
    originCity: formData.get('originCity'),
    destinationCity: formData.get('destinationCity'),
    itemName: formData.get('itemName'),
    itemType: formData.get('itemType'),
    itemWeight: formData.get('itemWeight'),
    price: formData.get('price'),
    vehicleName: formData.get('vehicleName'),
    vehicleType: formData.get('vehicleType'),
    vehicleCode: formData.get('vehicleCode'),
    vehicleCapacity: formData.get('vehicleCapacity'),
    vehicleStatus: formData.get('vehicleStatus'),
    shippingType: formData.get('shippingType'),
    shipmentStatus: formData.get('shipmentStatus'),
    notes: formData.get('notes'),
  });

  await sql`
    UPDATE shipment_transactions
    SET
      shipping_date = ${validatedFields.shippingDate},
      sender_name = ${validatedFields.senderName},
      receiver_name = ${validatedFields.receiverName},
      phone_number = ${validatedFields.phoneNumber},
      origin_city = ${validatedFields.originCity},
      destination_city = ${validatedFields.destinationCity},
      item_name = ${validatedFields.itemName},
      item_type = ${validatedFields.itemType},
      item_weight = ${validatedFields.itemWeight},
      price = ${validatedFields.price},
      vehicle_name = ${validatedFields.vehicleName},
      vehicle_type = ${validatedFields.vehicleType},
      vehicle_code = ${validatedFields.vehicleCode},
      vehicle_capacity = ${validatedFields.vehicleCapacity},
      vehicle_status = ${validatedFields.vehicleStatus},
      shipping_type = ${validatedFields.shippingType},
      shipment_status = ${validatedFields.shipmentStatus},
      notes = ${validatedFields.notes || null}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/map/shipments');
  redirect('/dashboard/map/shipments');
}

export async function deleteShipmentTransaction(id: string) {
  await sql`
    DELETE FROM shipment_transactions
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/map/shipments');
}

//vehicle
const VehicleSchema = z.object({
  vehicleCode: z.string().min(1),
  vehicleName: z.string().min(1),
  vehicleType: z.string().min(1),
  capacity: z.string().min(1),
  status: z.string().min(1),
  registryStatus: z.string().optional(),
  hullIntegrity: z.string().optional(),
});

function getVehicleStatusColor(status: string) {
  switch (status) {
    case 'EN ROUTE':
      return 'text-emerald-500';
    case 'MAINTENANCE':
      return 'text-rose-500';
    case 'IN PORT':
      return 'text-indigo-500';
    case 'ANCHORAGE':
      return 'text-amber-500';
    default:
      return 'text-gray-400';
  }
}

export async function createVehicle(formData: FormData) {
  const validatedFields = VehicleSchema.parse({
    vehicleCode: formData.get('vehicleCode'),
    vehicleName: formData.get('vehicleName'),
    vehicleType: formData.get('vehicleType'),
    capacity: formData.get('capacity'),
    status: formData.get('status'),
    registryStatus: formData.get('registryStatus'),
    hullIntegrity: formData.get('hullIntegrity'),
  });

  await sql`
    INSERT INTO vehicles (
      vehicle_code,
      vehicle_name,
      vehicle_type,
      capacity,
      status,
      status_color,
      registry_status,
      hull_integrity
    )
    VALUES (
      ${validatedFields.vehicleCode},
      ${validatedFields.vehicleName},
      ${validatedFields.vehicleType},
      ${validatedFields.capacity},
      ${validatedFields.status},
      ${getVehicleStatusColor(validatedFields.status)},
      ${validatedFields.registryStatus || '2026-ACTIVE'},
      ${validatedFields.hullIntegrity || 'OPTIMAL'}
    )
  `;

  revalidatePath('/dashboard/fleet/vessels');
  redirect('/dashboard/fleet/vessels');
}

export async function updateVehicle(id: string, formData: FormData) {
  const validatedFields = VehicleSchema.parse({
    vehicleCode: formData.get('vehicleCode'),
    vehicleName: formData.get('vehicleName'),
    vehicleType: formData.get('vehicleType'),
    capacity: formData.get('capacity'),
    status: formData.get('status'),
    registryStatus: formData.get('registryStatus'),
    hullIntegrity: formData.get('hullIntegrity'),
  });

  await sql`
    UPDATE vehicles
    SET
      vehicle_code = ${validatedFields.vehicleCode},
      vehicle_name = ${validatedFields.vehicleName},
      vehicle_type = ${validatedFields.vehicleType},
      capacity = ${validatedFields.capacity},
      status = ${validatedFields.status},
      status_color = ${getVehicleStatusColor(validatedFields.status)},
      registry_status = ${validatedFields.registryStatus || '2026-ACTIVE'},
      hull_integrity = ${validatedFields.hullIntegrity || 'OPTIMAL'}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/fleet/vessels');
  redirect('/dashboard/fleet/vessels');
}

export async function deleteVehicle(id: string) {
  await sql`
    DELETE FROM vehicles
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/fleet/vessels');
}

//MAINTENANCE
const MaintenanceSchema = z.object({
  vessel_id: z.string().uuid(), // MEMASTIKAN format input UUID benar
  task: z.string().min(1),
  status: z.enum(["PLANNED", "IN_PROGRESS", "DONE"]), // MEMBATASI input agar tidak asal
  date: z.string(), // Format tanggal
});

export async function saveSchedule(formData: FormData) {
  const id = formData.get('id') as string;

  const validated = MaintenanceSchema.safeParse({
    vessel_id: formData.get('vessel_id'),
    task: formData.get('task'),
    status: formData.get('status'),
    date: formData.get('date'),
  });

  if (!validated.success) {
    console.error("Validasi Gagal:", validated.error);
    return { error: "Data tidak valid" }; 
  }

  const { vessel_id, task, status, date } = validated.data;

  console.log("Mencoba menyimpan data:", { id, vessel_id, task, status, date });

  try {
    if (id) {
      const result = await sql`UPDATE maintenance_schedules SET vessel_id=${vessel_id}, task=${task}, status=${status}, maintenance_date=${date} WHERE id=${id}`;
      console.log("Update result:", result);
    } else {
      const result = await sql`INSERT INTO maintenance_schedules (vessel_id, task, status, maintenance_date) VALUES (${vessel_id}, ${task}, ${status}, ${date})`;
      console.log("Insert result:", result);
    }
    
    console.log("Data berhasil diproses ke database!");
    revalidatePath('/maintenance');
  } catch (error) {
    console.error("GAGAL SIMPAN KE DATABASE:", error);
  }
}

export async function deleteSchedule(id: string) {
  await sql`DELETE FROM maintenance_schedules WHERE id=${id}`;
  revalidatePath('/maintenance');
}