// app/actions/deleteVehicleAction.ts
'use server';

import { deleteVehicle as deleteVehicleFromDB } from '@/app/lib/actions';

export async function deleteVehicleAction(vehicleId: string) {
  await deleteVehicleFromDB(vehicleId);
}