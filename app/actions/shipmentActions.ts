'use server';

import { sql } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function createShipment(prevState: any, formData: FormData) {
  try {
    // Get form data
    const shippingDate = formData.get('shipping_date') as string;
    const shippingType = formData.get('shipping_type') as string;
    const shipmentStatus = formData.get('shipment_status') as string;
    const senderName = formData.get('sender_name') as string;
    const receiverName = formData.get('receiver_name') as string;
    const phoneNumber = formData.get('phone_number') as string;
    const originCity = formData.get('origin_city') as string;
    const destinationCity = formData.get('destination_city') as string;
    const itemName = formData.get('item_name') as string;
    const itemType = formData.get('item_type') as string;
    const itemWeightRaw = formData.get('item_weight') as string;
    const priceRaw = formData.get('price') as string;
    const vehicleId = formData.get('vehicle_id') as string;
    const notes = formData.get('notes') as string || null; // OPTIONAL

    const itemWeight = parseInt(itemWeightRaw);
    const price = parseInt(priceRaw);

    // Validation
    if (!shippingDate || !shippingType || !shipmentStatus || 
        !senderName || !receiverName || !phoneNumber || 
        !originCity || !destinationCity || 
        !itemName || !itemType || !itemWeightRaw || !priceRaw || !vehicleId || !notes) {
      return { 
        success: false, 
        error: 'Semua field wajib diisi dan tidak boleh kosong' 
      };
    }

    if (!/^[a-zA-Z\s]+$/.test(senderName)) {
      return { success: false, error: 'Nama pengirim hanya boleh berisi huruf dan spasi' };
    }
    if (!/^[a-zA-Z\s]+$/.test(receiverName)) {
      return { success: false, error: 'Nama penerima hanya boleh berisi huruf dan spasi' };
    }
    if (!/^[a-zA-Z\s]+$/.test(originCity)) {
      return { success: false, error: 'Kota asal hanya boleh berisi huruf dan spasi' };
    }
    if (!/^[a-zA-Z\s]+$/.test(destinationCity)) {
      return { success: false, error: 'Kota tujuan hanya boleh berisi huruf dan spasi' };
    }
    if (!/^[a-zA-Z\s]+$/.test(itemName)) {
      return { success: false, error: 'Nama barang hanya boleh berisi huruf dan spasi' };
    }
    if (!/^[a-zA-Z\s]+$/.test(itemType)) {
      return { success: false, error: 'Tipe barang hanya boleh berisi huruf dan spasi' };
    }

    if (!/^\d+$/.test(phoneNumber)) {
      return { success: false, error: 'Nomor HP harus berupa angka' };
    }
    if (phoneNumber.length < 10 || phoneNumber.length > 13) {
      return { success: false, error: 'Nomor HP harus berukuran 10 sampai 13 digit' };
    }

    if (isNaN(itemWeight)) {
      return { success: false, error: 'Berat barang harus berupa angka' };
    }
    if (itemWeight < 10) {
      return { success: false, error: 'Berat barang minimal 10 kg' };
    }

    if (isNaN(price)) {
      return { success: false, error: 'Harga harus berupa angka' };
    }
    if (price <= 0) {
      return { success: false, error: 'Harga harus lebih besar dari 0' };
    }

    // Get vehicle details from database
    const vehicleResult = await sql`
      SELECT vehicle_name, vehicle_type, vehicle_code, capacity as vehicle_capacity, status
      FROM vehicles
      WHERE id = ${vehicleId}
    `;

    if ((vehicleResult as any[]).length === 0) {
      return { success: false, error: 'Kendaraan tidak ditemukan' };
    }

    const vehicle = (vehicleResult as any[])[0];

    // Generate tracking number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const trackingNumber = `STN-${year}-${randomNum}`;

    // Insert into database
    await sql`
      INSERT INTO shipment_transactions (
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
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        ${trackingNumber},
        ${shippingDate},
        ${senderName},
        ${receiverName},
        ${phoneNumber},
        ${originCity},
        ${destinationCity},
        ${itemName},
        ${itemType},
        ${itemWeight},
        ${price},
        ${vehicle.vehicle_name},
        ${vehicle.vehicle_type},
        ${vehicle.vehicle_code},
        ${vehicle.vehicle_capacity},
        ${vehicle.status},
        ${shippingType},
        ${shipmentStatus},
        ${notes},
        NOW(),
        NOW()
      )
    `;

    // Revalidate
    revalidatePath('/dashboard/map/shipments');
    
    return { 
      success: true, 
      message: 'Shipment berhasil dibuat',
      trackingNumber 
    };
  } catch (error) {
    console.error('Error creating shipment:', error);
    return { 
      success: false, 
      error: 'Gagal membuat shipment: ' + (error as Error).message 
    };
  }
}
