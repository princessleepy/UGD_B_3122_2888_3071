import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchVehicleById } from '@/app/lib/data';
import { updateVehicle } from '@/app/lib/actions';

export const dynamic = 'force-dynamic';

export default async function EditVesselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    const vehicle = await fetchVehicleById(id);
    
    if (!vehicle) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Edit Vehicle</h1>
            <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1 uppercase">Update vehicle information</p>
          </div>
          <Link href="/dashboard/fleet/vessels" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Back</Link>
        </div>

        <div className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
          <form
            action={async (formData: FormData) => {
              'use server';
              await updateVehicle({ success: false }, formData);
            }}
            className="space-y-8"
          >
            <input type="hidden" name="id" value={vehicle.id} />
            
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">Vehicle Identity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Vehicle Name" name="vehicleName" defaultValue={vehicle.vehicle_name} />
                <Input label="Vehicle Code" name="vehicleCode" defaultValue={vehicle.vehicle_code} />
                <Input label="Vehicle Type" name="vehicleType" defaultValue={vehicle.vehicle_type} />
                <Input label="Capacity" name="capacity" defaultValue={vehicle.capacity} />
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">Status & Registry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select label="Status" name="status" options={['EN ROUTE', 'MAINTENANCE', 'IN PORT', 'ANCHORAGE']} defaultValue={vehicle.status} />
                <Input label="Registry Status" name="registryStatus" defaultValue={vehicle.registry_status || '2026-ACTIVE'} />
                <Input label="Hull Integrity" name="hullIntegrity" defaultValue={vehicle.hull_integrity || 'OPTIMAL'} className="md:col-span-2" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/dashboard/fleet/vessels" className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Cancel</Link>
              <button type="submit" className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all">Update Vehicle</button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading vehicle:', error);
    notFound();
  }
}

function Input({ label, name, defaultValue, className }: { label: string; name: string; defaultValue?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <input required name={name} defaultValue={defaultValue} className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60" />
    </div>
  );
}

function Select({ label, name, options, defaultValue }: { label: string; name: string; options: string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <select required name={name} defaultValue={defaultValue} className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60">
        {options.map((opt) => <option key={opt} value={opt} className="bg-[#150e24]">{opt}</option>)}
      </select>
    </div>
  );
}