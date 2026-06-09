import { fetchAvailableVehicles } from '@/app/lib/data';
import CreateShipmentClient from './CreateShipmentClient';

export const dynamic = 'force-dynamic';

export default async function CreateShipmentPage() {
  const availableVehicles = await fetchAvailableVehicles();
  return <CreateShipmentClient availableVehicles={availableVehicles} />;
}
