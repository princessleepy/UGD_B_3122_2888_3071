import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchAllVehiclesAction, fetchShipmentTransactionByIdAction } from '@/app/lib/actions';
import EditShipmentForm from './EditShipmentForm'; //Import client component

import { generatePageMetadata } from '@/app/lib/metadata';

// METADATA untuk halaman ini
export const metadata = generatePageMetadata({
  title: 'Edit Shipment',
  description: 'Update cargo transaction data',
  keywords: ['shipment', 'edit', 'update', 'cargo', 'logistics'],
});

export default async function EditShipmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // 1. Fetch data langsung di Server Component (Instan!)
  const shipment = await fetchShipmentTransactionByIdAction(params.id);
  if (!shipment) notFound();

  const vehicles = await fetchAllVehiclesAction();
  const selectedVehicle =
  vehicles.find(
    (v) => v.vehicle_code === shipment.vehicle_code
  );

  // 2. Kirim data tersebut sebagai PROPS ke Form
  return (
    <EditShipmentForm 
      shipmentId={params.id}           // Sesuaikan dengan nama props di form
      initialData={shipment}           // Kirim 'shipment' sebagai 'initialData'
      selectedVehicle={selectedVehicle} // Kirim 'selectedVehicle' sebagai 'selectedVehicle'
      vehicles={vehicles}              // Kirim 'vehicles' list untuk dropdown
    />
  );
}