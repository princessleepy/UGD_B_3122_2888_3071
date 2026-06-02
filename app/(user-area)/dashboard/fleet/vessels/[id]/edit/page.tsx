import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchVehicleById } from '@/app/lib/data';
import { updateVesselFormAction } from '@/app/lib/actions'; // ✅ Gunakan wrapper

export const dynamic = 'force-dynamic';

export default async function EditVesselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    const vessel = await fetchVehicleById(id); // ✅ Fetch data
    
    if (!vessel) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Edit Vessel</h1>
            <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1 uppercase">Update vessel information</p>
          </div>
          <Link href="/dashboard/fleet/vessels" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Back</Link>
        </div>

        <div className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
          {/* ✅ Form action pakai wrapper function (tanpa inline 'use server') */}
          <form action={updateVesselFormAction as unknown as (formData: FormData) => Promise<void>} className="space-y-8">
            <input type="hidden" name="id" value={vessel.id} />
            
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">Vessel Identity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Vessel Name" name="vesselName" defaultValue={vessel.vehicle_name} />
                <Input label="Vessel Code" name="vesselCode" defaultValue={vessel.vehicle_code} />
                <Input label="Vessel Type" name="vesselType" defaultValue={vessel.vehicle_type} />
                <Input label="Capacity" name="capacity" defaultValue={vessel.capacity} />
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">Status & Registry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select label="Status" name="status" options={['EN ROUTE', 'MAINTENANCE', 'IN PORT', 'ANCHORAGE']} defaultValue={vessel.status} />
                <Input label="Registry Status" name="registryStatus" defaultValue={vessel.registry_status || '2026-ACTIVE'} />
                <Input label="Hull Integrity" name="hullIntegrity" defaultValue={vessel.hull_integrity || 'OPTIMAL'} className="md:col-span-2" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/dashboard/fleet/vessels" className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Cancel</Link>
              <button type="submit" className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all">Update Vessel</button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading vessel:', error);
    notFound();
  }
}

// ✅ Input Component
function Input({ label, name, defaultValue, className }: { label: string; name: string; defaultValue?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60"
      />
    </div>
  );
}

// ✅ Select Component
function Select({ label, name, options, defaultValue }: { label: string; name: string; options: string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60"
      >
        <option value="">Select option</option>
        {options.map((opt) => <option key={opt} value={opt} className="bg-[#150e24]">{opt}</option>)}
      </select>
    </div>
  );
}