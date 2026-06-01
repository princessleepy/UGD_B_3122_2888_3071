import Link from 'next/link';
import { fetchShipmentTransactionById } from '@/app/lib/data';
import EditShipmentForm from './EditShipmentForm'; //Import client component

import { generatePageMetadata } from '@/app/lib/metadata';

// METADATA untuk halaman ini
export const metadata = generatePageMetadata({
  title: 'Edit Shipment',
  description: 'Update cargo transaction data',
  keywords: ['shipment', 'edit', 'update', 'cargo', 'logistics'],
});

export default async function EditShipmentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const shipment = await fetchShipmentTransactionById(params.id);

  const vehicles = [
    { name: 'NEON HORIZON', type: 'Cargo Vessel', code: 'MV-19910011', capacity: '14000 MT', status: 'ACTIVE' },
    { name: 'OCEAN STAR', type: 'Bulk Carrier', code: 'MV-19910022', capacity: '62500 MT', status: 'MAINTENANCE' },
    { name: 'SEA VOYAGER', type: 'Container Vessel', code: 'MV-20030033', capacity: '2400 MT', status: 'IN PORT' },
    { name: 'ARCTIC GALE', type: 'Cargo Vessel', code: 'MV-20040044', capacity: '1204 NM', status: 'ACTIVE' },
    { name: 'PACIFIC DRIFT', type: 'Tanker Vessel', code: 'MV-20050055', capacity: '2150 NM', status: 'ANCHORAGE' },
    { name: 'TITAN WAVE', type: 'Cargo Vessel', code: 'MV-20060066', capacity: '3880 NM', status: 'ACTIVE' },
    { name: 'BLACK PEARL', type: 'Tanker Vessel', code: 'MV-20070077', capacity: '2640 NM', status: 'ANCHORAGE' },
    { name: 'STORM CHASER', type: 'Container Vessel', code: 'MV-20080088', capacity: '540 NM', status: 'MAINTENANCE' },
    { name: 'BLUE LEVIATHAN', type: 'Chemical Tanker', code: 'MV-20090099', capacity: '3010 NM', status: 'IN PORT' },
    { name: 'IRON TITAN', type: 'Heavy Lift Vessel', code: 'MV-20100100', capacity: '4620 NM', status: 'ACTIVE' },
  ];

  const selectedVehicle = vehicles.find((v) => v.name === shipment.vehicle_name) || vehicles[0];

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Edit Shipment</h1>
          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1 uppercase">
            Update cargo transaction data
          </p>
        </div>
        <Link
          href="/dashboard/map/shipments"
          className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          Back
        </Link>
      </div>

      {/* ✅ Pass data ke Client Component */}
      <EditShipmentForm
        shipmentId={params.id}
        initialData={shipment}
        selectedVehicle={selectedVehicle}
      />
    </div>
  );
}