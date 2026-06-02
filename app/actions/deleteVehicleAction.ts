// app/actions/deleteVehicleAction.ts
'use server';

// ✅ PERBAIKAN: Import deleteVehicle (bukan deleteVessel)
import { deleteVehicle as deleteVehicleFromDB, type ActionResponse } from '@/app/lib/actions';

export async function deleteVehicleAction(vehicleId: string): Promise<ActionResponse> {
  try {
    await deleteVehicleFromDB(vehicleId);
    return { 
      success: true, 
      redirectUrl: '/dashboard/fleet/vessels' 
    };
  } catch (error) {
    console.error('Delete error:', error);
    return { 
      success: false, 
      error: 'Gagal menghapus vessel' 
    };
  }
}