import Link from 'next/link';
import {
  fetchAvailableVehicles,
  fetchShipmentTransactionById,
} from '@/app/lib/data';
import EditShipmentForm from './EditShipmentForm';
import { generatePageMetadata } from '@/app/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Edit Shipment',
  description: 'Update cargo transaction data',
  keywords: ['shipment', 'edit', 'update', 'cargo', 'logistics'],
});

export default async function EditShipmentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [shipment, availableVehicles] = await Promise.all([
    fetchShipmentTransactionById(params.id),
    fetchAvailableVehicles(),
  ]);

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Edit Shipment
          </h1>
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

      <EditShipmentForm
        shipmentId={params.id}
        initialData={shipment}
        availableVehicles={availableVehicles}
      />
    </div>
  );
}
