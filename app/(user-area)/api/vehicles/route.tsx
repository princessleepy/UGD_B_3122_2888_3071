import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/app/lib/db';
import { z } from 'zod';

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
  const colors: Record<string, string> = {
    'EN ROUTE': 'text-emerald-500',
    'MAINTENANCE': 'text-rose-500',
    'IN PORT': 'text-indigo-500',
    'ANCHORAGE': 'text-amber-500',
  };
  return colors[status] || 'text-gray-400';
}

export async function POST(request: Request) {
  try {
    // Cek role
    const cookieStore = await cookies();
    const role = cookieStore.get('userRole')?.value;
    if (!['admin', 'operator'].includes(role || '')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const validated = VehicleSchema.safeParse({
      vehicleCode: formData.get('vehicleCode'),
      vehicleName: formData.get('vehicleName'),
      vehicleType: formData.get('vehicleType'),
      capacity: formData.get('capacity'),
      status: formData.get('status'),
      registryStatus: formData.get('registryStatus'),
      hullIntegrity: formData.get('hullIntegrity'),
    });

    if (!validated.success) {
      return NextResponse.json({ success: false, error: 'Validasi gagal' }, { status: 400 });
    }

    await sql`
      INSERT INTO vehicles (vehicle_code, vehicle_name, vehicle_type, capacity, status, status_color, registry_status, hull_integrity)
      VALUES (${validated.data.vehicleCode}, ${validated.data.vehicleName}, ${validated.data.vehicleType}, ${validated.data.capacity}, ${validated.data.status}, ${getVehicleStatusColor(validated.data.status)}, ${validated.data.registryStatus || '2026-ACTIVE'}, ${validated.data.hullIntegrity || 'OPTIMAL'})
    `;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan' }, { status: 500 });
  }
}