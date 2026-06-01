'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ✅ TIPE RESPON KONSISTEN UNTUK SEMUA ACTION
export type ActionResponse = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  redirectUrl?: string;
};

// ==================== ROLE HELPER (R4 - Role-Based Access) ====================

/**
 * Helper untuk validasi role user
 * @param allowedRoles - Array role yang diizinkan mengakses action ini
 * @throws Error jika user tidak memiliki role yang diizinkan
 */
async function requireRole(allowedRoles: string[]) {  // ✅ TAMBAHKAN async
  const cookieStore = await cookies();  // ✅ TAMBAHKAN await
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
    // Cek user di database
    const result = await sql`
      SELECT id, email, password_hash, role, full_name
      FROM users
      WHERE email = ${email}
    `;

    if (result.length === 0) {
      return { success: false, error: 'Email tidak terdaftar' };
    }

    const user = result[0];

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return { success: false, error: 'Password salah' };
    }

    // Update last_login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

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

function generateTrackingNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const unique = Date.now().toString().slice(-6);
  return `STN-${year}-${unique}`;
}

// ✅ CREATE SHIPMENT - R4: Admin & Operator boleh create
export async function createShipmentTransaction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE
  try {
    await requireRole(['admin', 'operator']);  // ✅ TAMBAHKAN await
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
    const trackingNumber = generateTrackingNumber();
    
    await sql`
      INSERT INTO shipment_transactions (
        tracking_number, shipping_date, sender_name, receiver_name,
        phone_number, origin_city, destination_city, item_name,
        item_type, item_weight, price, vehicle_name, vehicle_type,
        vehicle_code, vehicle_capacity, vehicle_status,
        shipping_type, shipment_status, notes
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
        ${validatedFields.data.notes || null}
      )
    `;

    revalidatePath('/dashboard/map/shipments');
    return { success: true, redirectUrl: '/dashboard/map/shipments' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal menyimpan data. Silakan coba lagi.' };
  }
}

// ✅ UPDATE SHIPMENT - R4: Admin & Operator boleh update
export async function updateShipmentTransaction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE
  try {
    await requireRole(['admin', 'operator']);  // ✅ TAMBAHKAN await
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
        notes = ${validatedFields.data.notes || null}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/map/shipments');
    return { success: true, redirectUrl: '/dashboard/map/shipments' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal memperbarui data. Silakan coba lagi.' };
  }
}

// ✅ DELETE SHIPMENT - R4: HANYA Admin boleh delete
export async function deleteShipmentTransaction(id: string): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE: Admin only
  try {
    await requireRole(['admin']);  // ✅ TAMBAHKAN await
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
  vehicleCode: z.string().min(1, 'Kode kendaraan wajib diisi'),
  vehicleName: z.string().min(1, 'Nama kendaraan wajib diisi'),
  vehicleType: z.string().min(1, 'Jenis kendaraan wajib diisi'),
  capacity: z.string().min(1, 'Kapasitas wajib diisi'),
  status: z.string().min(1, 'Status wajib diisi'),
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

// ✅ CREATE VEHICLE - R4: Admin & Operator boleh create
export async function createVehicle(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE
  try {
    await requireRole(['admin', 'operator']);  // ✅ TAMBAHKAN await
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Anda tidak memiliki izin untuk menambah kendaraan' 
    };
  }

  const validatedFields = VehicleSchema.safeParse({
    vehicleCode: formData.get('vehicleCode'),
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
      INSERT INTO vehicles (
        vehicle_code, vehicle_name, vehicle_type, capacity,
        status, status_color, registry_status, hull_integrity
      ) VALUES (
        ${validatedFields.data.vehicleCode},
        ${validatedFields.data.vehicleName},
        ${validatedFields.data.vehicleType},
        ${validatedFields.data.capacity},
        ${validatedFields.data.status},
        ${getVehicleStatusColor(validatedFields.data.status)},
        ${validatedFields.data.registryStatus || '2026-ACTIVE'},
        ${validatedFields.data.hullIntegrity || 'OPTIMAL'}
      )
    `;

    revalidatePath('/dashboard/fleet/vessels');
    return { success: true, redirectUrl: '/dashboard/fleet/vessels' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal menambahkan kendaraan.' };
  }
}

// ✅ UPDATE VEHICLE - R4: Admin & Operator boleh update
export async function updateVehicle(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE
  try {
    await requireRole(['admin', 'operator']);  // ✅ TAMBAHKAN await
  } catch (error) {
    return { 
      success: false, 
      error: 'Unauthorized: Anda tidak memiliki izin untuk mengubah data kendaraan' 
    };
  }

  const id = formData.get('id') as string;
  
  const validatedFields = VehicleSchema.safeParse({
    vehicleCode: formData.get('vehicleCode'),
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
        vehicle_code = ${validatedFields.data.vehicleCode},
        vehicle_name = ${validatedFields.data.vehicleName},
        vehicle_type = ${validatedFields.data.vehicleType},
        capacity = ${validatedFields.data.capacity},
        status = ${validatedFields.data.status},
        status_color = ${getVehicleStatusColor(validatedFields.data.status)},
        registry_status = ${validatedFields.data.registryStatus || '2026-ACTIVE'},
        hull_integrity = ${validatedFields.data.hullIntegrity || 'OPTIMAL'}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/fleet/vessels');
    return { success: true, redirectUrl: '/dashboard/fleet/vessels' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal memperbarui kendaraan.' };
  }
}

// ✅ DELETE VEHICLE - R4: HANYA Admin boleh delete
export async function deleteVehicle(id: string): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE: Admin only
  try {
    await requireRole(['admin']);  // ✅ TAMBAHKAN await
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

// ✅ SAVE SCHEDULE - R4: Admin & Operator boleh manage maintenance
export async function saveSchedule(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE
  try {
    await requireRole(['admin', 'operator']);  // ✅ TAMBAHKAN await
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
        SET vessel_id=${vessel_id}, task=${task}, status=${status}, maintenance_date=${date} 
        WHERE id=${id}
      `;
    } else {
      await sql`
        INSERT INTO maintenance_schedules (vessel_id, task, status, maintenance_date) 
        VALUES (${vessel_id}, ${task}, ${status}, ${date})
      `;
    }
    
    revalidatePath('/maintenance');
    return { success: true, redirectUrl: '/maintenance' };
    
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Gagal menyimpan jadwal maintenance.' };
  }
}

// ✅ DELETE SCHEDULE - R4: HANYA Admin boleh delete schedule
export async function deleteSchedule(id: string): Promise<ActionResponse> {
  // 🔐 VALIDASI ROLE: Admin only
  try {
    await requireRole(['admin']);  // ✅ TAMBAHKAN await
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

/**
 * Wrapper untuk createVehicle
 */
export async function createVehicleFormAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  'use server';  // ✅ TAMBAHKAN INI!
  return createVehicle(prevState, formData);
}

/**
 * Wrapper untuk updateVehicle
 */
export async function updateVehicleFormAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  'use server';  // ✅ TAMBAHKAN INI!
  return updateVehicle(prevState, formData);
}

/**
 * Wrapper untuk deleteVehicle
 */
export async function deleteVehicleFormAction(id: string): Promise<ActionResponse> {
  'use server';  // ✅ TAMBAHKAN INI!
  return deleteVehicle(id);
}

/**
 * Wrapper untuk deleteShipmentTransaction
 */
export async function deleteShipmentFormAction(id: string): Promise<ActionResponse> {
  'use server';  // ✅ TAMBAHKAN INI!
  return deleteShipmentTransaction(id);
}

/**
 * Wrapper untuk deleteSchedule
 */
export async function deleteScheduleFormAction(id: string): Promise<ActionResponse> {
  'use server';  // ✅ TAMBAHKAN INI!
  return deleteSchedule(id);
}