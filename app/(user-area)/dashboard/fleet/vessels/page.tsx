import Link from 'next/link';

import {
  fetchFilteredVehicles,
  fetchVehiclePages,
} from '@/app/lib/data';

import { createVehicle, deleteVehicle } from '@/app/lib/actions';

export const dynamic = 'force-dynamic';

export default async function VesselListPage(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const status = searchParams?.status || 'ALL';
  const currentPage = Number(searchParams?.page) || 1;

  const vehicles = await fetchFilteredVehicles(query, status, currentPage);
  const totalPages = await fetchVehiclePages(query, status);

  const previousPageUrl = `/dashboard/fleet/vessels?query=${encodeURIComponent(
    query
  )}&status=${encodeURIComponent(status)}&page=${Math.max(
    currentPage - 1,
    1
  )}`;

  const nextPageUrl = `/dashboard/fleet/vessels?query=${encodeURIComponent(
    query
  )}&status=${encodeURIComponent(status)}&page=${Math.min(
    currentPage + 1,
    totalPages || 1
  )}`;

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8 relative">
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            All Vessels
          </h1>

          <div className="flex gap-4 mt-2">
            <form className="flex gap-4">
              <input
                type="hidden"
                name="query"
                value={query}
              />

              <select
                name="status"
                defaultValue={status}
                className="bg-[#150e24] border border-white/10 rounded-md px-3 py-1 text-[9px] font-bold text-gray-400 outline-none hover:border-[#bc66ff]/50 transition-all cursor-pointer"
              >
                <option value="ALL">STATUS: ALL UNITS</option>
                <option value="EN ROUTE">STATUS: EN ROUTE</option>
                <option value="MAINTENANCE">STATUS: MAINTENANCE</option>
                <option value="IN PORT">STATUS: IN PORT</option>
                <option value="ANCHORAGE">STATUS: ANCHORAGE</option>
              </select>

              <button
                type="submit"
                className="bg-white/5 border border-white/10 px-4 py-1 rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
              Operational Status
            </p>

            <p className="text-xl font-black text-[#bc66ff]">
              98.2%{' '}
              <span className="text-[9px] text-gray-400 uppercase font-bold">
                Ready
              </span>
            </p>
          </div>

          <details className="relative">
            <summary className="list-none cursor-pointer bg-[#bc66ff] hover:bg-[#a347ff] text-black font-black text-[10px] px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(188,102,255,0.4)]">
              Register Vessel
            </summary>

            <div className="absolute right-0 top-14 z-50 w-[460px] bg-[#110a1c] border border-[#bc66ff]/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(188,102,255,0.15)]">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#bc66ff] mb-5">
                Register New Vehicle
              </h2>

              <form action={createVehicle} className="space-y-3 text-[10px]">
                <Input label="Vehicle Name" name="vehicleName" />
                <Input label="Vehicle Code" name="vehicleCode" />

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Vehicle Type" name="vehicleType" />
                  <Input label="Capacity" name="capacity" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Status"
                    name="status"
                    options={[
                      'EN ROUTE',
                      'MAINTENANCE',
                      'IN PORT',
                      'ANCHORAGE',
                    ]}
                  />

                  <Input
                    label="Registry Status"
                    name="registryStatus"
                    defaultValue="2026-ACTIVE"
                  />
                </div>

                <Input
                  label="Hull Integrity"
                  name="hullIntegrity"
                  defaultValue="OPTIMAL"
                />

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#bc66ff] hover:bg-[#a347ff] py-2.5 rounded-full uppercase tracking-widest font-black text-black transition-all text-[9px]"
                  >
                    Save Data
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </div>

      <form className="flex items-center gap-4">
        <input type="hidden" name="status" value={status} />

        <div className="relative flex-1">
          <input
            name="query"
            type="text"
            placeholder="QUERY VESSEL ID OR NAME..."
            defaultValue={query}
            className="w-full bg-[#150e24] border border-white/10 rounded-full py-3 px-12 text-[10px] font-bold focus:border-[#bc66ff] outline-none transition-all placeholder:text-gray-700"
          />

          <span className="absolute left-5 top-3 opacity-30 text-lg">
            Search
          </span>
        </div>

        <button
          type="submit"
          className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-[#150e24] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-[#bc66ff]/30 transition-all duration-500 shadow-2xl relative"
          >
            <div className="h-48 bg-gradient-to-b from-gray-800 to-[#150e24] relative flex items-center justify-center overflow-hidden">
              <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-700">
                Vessel
              </div>

              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[7px] font-black tracking-widest bg-current/10 ${vehicle.status_color}`}
              >
                {vehicle.status}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#150e24] to-transparent" />
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start relative">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-[#bc66ff] transition-colors">
                    {vehicle.vehicle_name}
                  </h3>

                  <p className="text-[9px] text-gray-600 font-bold tracking-widest uppercase">
                    ID: {vehicle.vehicle_code}
                  </p>
                </div>

                <div className="flex gap-3 text-[9px] font-black uppercase">
                  <Link
                    href={`/dashboard/fleet/vessels/${vehicle.id}/edit`}
                    className="text-[#bc66ff] hover:text-white"
                  >
                    Edit
                  </Link>

                  <form action={deleteVehicle.bind(null, vehicle.id)}>
                    <button
                      type="submit"
                      className="text-rose-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4">
                <Info label="Vehicle Type" value={vehicle.vehicle_type} />
                <Info label="Capacity" value={vehicle.capacity} />
                <Info label="Registry" value={vehicle.registry_status} />
                <Info label="Hull Integrity" value={vehicle.hull_integrity} />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] text-gray-600 font-bold italic uppercase">
                  Current Status:{' '}
                  {vehicle.status === 'MAINTENANCE'
                    ? 'UNDER REPAIR'
                    : 'ACTIVE'}
                </span>

                <button className="text-[8px] font-black uppercase tracking-widest text-[#bc66ff] hover:underline transition-all">
                  Vessel Logs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="py-16 text-center text-gray-600 font-black uppercase tracking-[0.2em]">
          No vehicle data found
        </div>
      )}

      <div className="flex justify-center gap-3 pt-8">
        <Link
          href={previousPageUrl}
          className={`px-5 py-2 rounded-full border border-white/10 text-xs uppercase hover:border-[#bc66ff] ${
            currentPage <= 1 ? 'pointer-events-none opacity-30' : ''
          }`}
        >
          Prev
        </Link>

        <div className="px-5 py-2 rounded-full bg-[#150e24] border border-white/10 text-xs uppercase tracking-widest">
          Page {currentPage} / {totalPages || 1}
        </div>

        <Link
          href={nextPageUrl}
          className={`px-5 py-2 rounded-full border border-white/10 text-xs uppercase hover:border-[#bc66ff] ${
            currentPage >= totalPages ? 'pointer-events-none opacity-30' : ''
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-gray-400 font-bold uppercase tracking-wider">
        {label}
      </label>

      <input
        required
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-[#07040d] border border-white/10 focus:border-[#bc66ff] rounded-xl p-2.5 outline-none font-bold text-white transition-all placeholder:text-gray-700"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div className="space-y-1">
      <label className="block text-gray-400 font-bold uppercase tracking-wider">
        {label}
      </label>

      <select
        required
        name={name}
        className="w-full bg-[#07040d] border border-white/10 focus:border-[#bc66ff] rounded-xl p-2.5 outline-none font-bold text-gray-300 cursor-pointer transition-all"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#150e24]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">
        {label}
      </p>

      <p className="text-[10px] font-bold text-white/90 uppercase">
        {value}
      </p>
    </div>
  );
}