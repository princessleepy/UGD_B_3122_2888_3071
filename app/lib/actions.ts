'use server';

import { z } from 'zod';
import { sql } from './db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';



// ✅ TIPE RESPON KONSISTEN UNTUK SEMUA ACTION
export type ActionResponse = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  redirectUrl?: string;
};

// ==================== ROLE HELPER (R4 - Role-Based Access) ====================

async function requireRole(allowedRoles: string[]) {
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;
  
  if (!role || !allowedRoles.includes(role)) {
    throw new Error('Unauthorized');
  }
}

// ==================== AUTH ACTIONS ====================

export async function loginUser(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email dan password wajib diisi' };
  }

  try {
    // ✅ QUERY SEDERHANA - TANPA JOIN
    const result = await sql`
      SELECT 
        user_id,
        email,
        full_name,
        role,
        is_active,
        last_login,
        username,
        password_hash
      FROM users
      WHERE email = ${email} AND is_active = true
    `;

    if (result.length === 0) {
      return { success: false, error: 'Email tidak terdaftar atau akun tidak aktif' };
    }

    const user = result[0];

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return { success: false, error: 'Password salah' };
    }

    // Update last_login
    await sql`
      UPDATE users 
      SET last_login = NOW()
      WHERE user_id = ${user.user_id}
    `;

    // Set cookies
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === 'production';
    
    cookieStore.set('isLoggedIn', 'true', { 
      httpOnly: true, 
      secure: isProd, 
      maxAge: 60 * 60 * 24, 
      path: '/' 
    });
    cookieStore.set('userRole', user.role, { 
      httpOnly: true, 
      secure: isProd, 
      maxAge: 60 * 60 * 24, 
      path: '/' 
    });
    cookieStore.set('userName', user.full_name, { 
      httpOnly: false, 
      secure: isProd, 
      maxAge: 60 * 60 * 24, 
      path: '/' 
    });
    cookieStore.set('userId', user.user_id, { 
      httpOnly: true, 
      secure: isProd, 
      maxAge: 60 * 60 * 24, 
      path: '/' 
    });

    // Redirect sesuai role
    const redirectUrl = user.role === 'admin' ? '/admin' : '/dashboard';
    return { success: true, redirectUrl };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Terjadi kesalahan server' };
  }
}

export async function logoutUser(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  cookieStore.delete('isLoggedIn');
  cookieStore.delete('userRole');
  cookieStore.delete('userName');
  cookieStore.delete('userId');
  return { success: true, redirectUrl: '/login' };
}

// ==================== SHIPMENT SCHEMA & ACTIONS ====================

const ShipmentSchema = z.object({
  shippingDate: z.string().min(1, 'Tanggal pengiriman wajib diisi'),
  senderName: z.string().min(1, 'Nama pengirim wajib diisi'),
  receiverName: z.string().min(1, 'Nama penerima wajib diisi'),
  phoneNumber: z.string().min(1, 'Nomor telepon wajib diisi'),
  originCity: z.string().min(1, 'Kota asal wajib diisi'),
  destinationCity: z.string().min(1, 'Kota tujuan wajib diisi'),
  itemName: z.string().min(1, 'Nama barang wajib diisi'),
  itemType: z.string().min(1, 'Jenis barang wajib diisi'),
  itemWeight: z.coerce.number().gt(0, 'Berat harus lebih dari 0'),
  price: z.coerce.number().gt(0, 'Harga harus lebih dari 0'),
  vehicleName: z.string().min(1, 'Nama kendaraan wajib diisi'),
  vehicleType: z.string().min(1, 'Jenis kendaraan wajib diisi'),
  vehicleCode: z.string().min(1, 'Kode kendaraan wajib diisi'),
  vehicleCapacity: z.string().min(1, 'Kapasitas wajib diisi'),
  vehicleStatus: z.string().min(1, 'Status kendaraan wajib diisi'),
  shippingType: z.string().min(1, 'Jenis pengiriman wajib diisi'),
  shipmentStatus: z.string().min(1, 'Status pengiriman wajib diisi'),
  notes: z.string().optional(),
});

async function generateTrackingNumber() {
  const year = new Date().getFullYear();

  const result = await sql`
    SELECT tracking_number
    FROM shipment_transactions
    WHERE tracking_number LIKE ${`STN-${year}-%`}
    ORDER BY tracking_number DESC
    LIMIT 1
  `;

  let nextNumber = 1;

  if (result.length > 0) {
    const lastTracking = result[0].tracking_number;
    const lastNumber = parseInt(lastTracking.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  return `STN-${year}-${String(nextNumber).padStart(3, '0')}`;
}

export async function createShipmentTransaction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireRole(['admin', 'operator']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Anda tidak memiliki izin untuk menambah data' 
    };
  }

  const validatedFields = ShipmentSchema.safeParse({
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

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validasi form gagal. Periksa kembali input Anda.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const trackingNumber = await generateTrackingNumber();
    
    await sql`
      INSERT INTO shipment_transactions (
        tracking_number, shipping_date, sender_name, receiver_name,
        phone_number, origin_city, destination_city, item_name,
        item_type, item_weight, price, vehicle_name, vehicle_type,
        vehicle_code, vehicle_capacity, vehicle_status,
        shipping_type, shipment_status, notes,
        created_at, updated_at
      ) VALUES (
        ${trackingNumber}, ${validatedFields.data.shippingDate},
        ${validatedFields.data.senderName}, ${validatedFields.data.receiverName},
        ${validatedFields.data.phoneNumber}, ${validatedFields.data.originCity},
        ${validatedFields.data.destinationCity}, ${validatedFields.data.itemName},
        ${validatedFields.data.itemType}, ${validatedFields.data.itemWeight},
        ${validatedFields.data.price}, ${validatedFields.data.vehicleName},
        ${validatedFields.data.vehicleType}, ${validatedFields.data.vehicleCode},
        ${validatedFields.data.vehicleCapacity}, ${validatedFields.data.vehicleStatus},
        ${validatedFields.data.shippingType}, ${validatedFields.data.shipmentStatus},
        ${validatedFields.data.notes || null},
        NOW(), NOW()
      )
    `;

    revalidatePath('/dashboard/map/shipments');
    return { success: true, redirectUrl: '/dashboard/map/shipments' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal menyimpan data. Silakan coba lagi.' };
  }
}

export async function updateShipmentTransaction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireRole(['admin', 'operator']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Anda tidak memiliki izin untuk mengubah data' 
    };
  }

  const id = formData.get('id') as string;
  
  const validatedFields = ShipmentSchema.safeParse({
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

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validasi form gagal. Periksa kembali input Anda.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await sql`
      UPDATE shipment_transactions
      SET
        shipping_date = ${validatedFields.data.shippingDate},
        sender_name = ${validatedFields.data.senderName},
        receiver_name = ${validatedFields.data.receiverName},
        phone_number = ${validatedFields.data.phoneNumber},
        origin_city = ${validatedFields.data.originCity},
        destination_city = ${validatedFields.data.destinationCity},
        item_name = ${validatedFields.data.itemName},
        item_type = ${validatedFields.data.itemType},
        item_weight = ${validatedFields.data.itemWeight},
        price = ${validatedFields.data.price},
        vehicle_name = ${validatedFields.data.vehicleName},
        vehicle_type = ${validatedFields.data.vehicleType},
        vehicle_code = ${validatedFields.data.vehicleCode},
        vehicle_capacity = ${validatedFields.data.vehicleCapacity},
        vehicle_status = ${validatedFields.data.vehicleStatus},
        shipping_type = ${validatedFields.data.shippingType},
        shipment_status = ${validatedFields.data.shipmentStatus},
        notes = ${validatedFields.data.notes || null},
        updated_at = NOW()
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/map/shipments');
    return { success: true, redirectUrl: '/dashboard/map/shipments' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal memperbarui data. Silakan coba lagi.' };
  }
}

export async function deleteShipmentTransaction(id: string): Promise<ActionResponse> {
  try {
    await requireRole(['admin']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Hanya admin yang dapat menghapus data' 
    };
  }

  try {
    await sql`DELETE FROM shipment_transactions WHERE id = ${id}`;
    revalidatePath('/dashboard/map/shipments');
    return { success: true, redirectUrl: '/dashboard/map/shipments' };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Gagal menghapus data.' };
  }
}

// ==================== VEHICLE SCHEMA & ACTIONS ====================

const VehicleSchema = z.object({
  vehicleName: z.string().min(1),
  vehicleType: z.string().min(1),
  capacity: z.string().min(1),
  status: z.string().min(1),
  registryStatus: z.string().optional(),
  hullIntegrity: z.string().optional(),
});

function getVehicleStatusColor(status: string) {
  switch (status) {
    case 'EN ROUTE': return 'text-emerald-500';
    case 'MAINTENANCE': return 'text-rose-500';
    case 'IN PORT': return 'text-indigo-500';
    case 'ANCHORAGE': return 'text-amber-500';
    default: return 'text-gray-400';
  }
}

export async function generateVehicleCode() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const datePart = `${yyyy}${mm}${dd}`;

  const result = await sql`
    SELECT vehicle_code
    FROM vehicles
    WHERE vehicle_code LIKE ${`MV-${datePart}-%`}
    ORDER BY vehicle_code DESC
    LIMIT 1
  `;

  let nextNumber = 1;

  if (result.length > 0) {
    const lastCode = result[0].vehicle_code;
    const lastNumber = parseInt(lastCode.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  return `MV-${datePart}-${String(nextNumber).padStart(3, '0')}`;
}

export async function createVehicle(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireRole(['admin', 'operator']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Anda tidak memiliki izin untuk menambah kendaraan' 
    };
  }

  const validatedFields = VehicleSchema.safeParse({
    vehicleName: formData.get('vehicleName'),
    vehicleType: formData.get('vehicleType'),
    capacity: formData.get('capacity'),
    status: formData.get('status'),
    registryStatus: formData.get('registryStatus'),
    hullIntegrity: formData.get('hullIntegrity'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validasi form gagal. Periksa kembali input Anda.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const vehicleCode = await generateVehicleCode();

    await sql`
      INSERT INTO vehicles (
        vehicle_code, vehicle_name, vehicle_type, capacity,
        status, status_color, registry_status, hull_integrity,
        created_at, updated_at
      ) VALUES (
        ${vehicleCode},
        ${validatedFields.data.vehicleName},
        ${validatedFields.data.vehicleType},
        ${validatedFields.data.capacity},
        ${validatedFields.data.status},
        ${getVehicleStatusColor(validatedFields.data.status)},
        ${validatedFields.data.registryStatus || '2026-ACTIVE'},
        ${validatedFields.data.hullIntegrity || 'OPTIMAL'},
        NOW(), NOW()
      )
    `;

    revalidatePath('/dashboard/fleet/vessels');
    return { success: true, redirectUrl: '/dashboard/fleet/vessels' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal menambahkan kendaraan.' };
  }
}

export async function updateVehicle(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireRole(['admin', 'operator']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Anda tidak memiliki izin untuk mengubah data kendaraan' 
    };
  }

  const id = formData.get('id') as string;
  
  const validatedFields = VehicleSchema.safeParse({
    vehicleName: formData.get('vehicleName'),
    vehicleType: formData.get('vehicleType'),
    capacity: formData.get('capacity'),
    status: formData.get('status'),
    registryStatus: formData.get('registryStatus'),
    hullIntegrity: formData.get('hullIntegrity'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validasi form gagal. Periksa kembali input Anda.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await sql`
      UPDATE vehicles
      SET
        vehicle_name = ${validatedFields.data.vehicleName},
        vehicle_type = ${validatedFields.data.vehicleType},
        capacity = ${validatedFields.data.capacity},
        status = ${validatedFields.data.status},
        status_color = ${getVehicleStatusColor(validatedFields.data.status)},
        registry_status = ${validatedFields.data.registryStatus || '2026-ACTIVE'},
        hull_integrity = ${validatedFields.data.hullIntegrity || 'OPTIMAL'},
        updated_at = NOW()
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/fleet/vessels');
    return { success: true, redirectUrl: '/dashboard/fleet/vessels' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal memperbarui kendaraan.' };
  }
}

export async function deleteVehicle(id: string): Promise<ActionResponse> {
  try {
    await requireRole(['admin']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Hanya admin yang dapat menghapus kendaraan' 
    };
  }

  try {
    await sql`DELETE FROM vehicles WHERE id = ${id}`;
    revalidatePath('/dashboard/fleet/vessels');
    return { success: true, redirectUrl: '/dashboard/fleet/vessels' };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Gagal menghapus kendaraan.' };
  }
}

// ==================== MAINTENANCE ACTIONS ====================

const MaintenanceSchema = z.object({
  vessel_id: z.string().uuid('ID vessel tidak valid'),
  task: z.string().min(1, 'Tugas maintenance wajib diisi'),
  status: z.enum(["PLANNED", "IN_PROGRESS", "DONE"], {
    errorMap: () => ({ message: 'Status tidak valid' })
  }),
  date: z.string().min(1, 'Tanggal wajib diisi'),
});

export async function saveSchedule(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await requireRole(['admin', 'operator']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Anda tidak memiliki izin untuk mengelola maintenance' 
    };
  }

  const id = formData.get('id') as string;

  const validated = MaintenanceSchema.safeParse({
    vessel_id: formData.get('vessel_id'),
    task: formData.get('task'),
    status: formData.get('status'),
    date: formData.get('date'),
  });

  if (!validated.success) {
    return {
      success: false,
      error: 'Validasi form gagal.',
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const { vessel_id, task, status, date } = validated.data;

  try {
    if (id && id !== 'new') {
      await sql`
        UPDATE maintenance_schedules 
        SET vessel_id=${vessel_id}, task=${task}, status=${status}, maintenance_date=${date}, updated_at=NOW()
        WHERE id=${id}
      `;
    } else {
      await sql`
        INSERT INTO maintenance_schedules (vessel_id, task, status, maintenance_date, created_at, updated_at) 
        VALUES (${vessel_id}, ${task}, ${status}, ${date}, NOW(), NOW())
      `;
    }
    
    revalidatePath('/maintenance');
    return { success: true, redirectUrl: '/maintenance' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal menyimpan jadwal maintenance.' };
  }
}

export async function deleteSchedule(id: string): Promise<ActionResponse> {
  try {
    await requireRole(['admin']);
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Hanya admin yang dapat menghapus jadwal' 
    };
  }

  try {
    await sql`DELETE FROM maintenance_schedules WHERE id=${id}`;
    revalidatePath('/maintenance');
    return { success: true, redirectUrl: '/maintenance' };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Gagal menghapus jadwal.' };
  }
}

// ==================== FORM ACTION WRAPPERS ====================

export async function createVehicleFormAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  'use server';
  return createVehicle(prevState, formData);
}

export async function updateVehicleFormAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  'use server';
  return updateVehicle(prevState, formData);
}

export async function deleteVehicleFormAction(id: string): Promise<ActionResponse> {
  'use server';
  return deleteVehicle(id);
}

export async function deleteShipmentFormAction(id: string): Promise<ActionResponse> {
  'use server';
  return deleteShipmentTransaction(id);
}

export async function deleteScheduleFormAction(id: string): Promise<ActionResponse> {
  'use server';
  return deleteSchedule(id);
}

// Bridge createVehicle to createVessel for VesselClient
export { createVehicle as createVessel };