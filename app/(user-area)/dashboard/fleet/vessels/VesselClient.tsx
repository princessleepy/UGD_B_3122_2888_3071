'use client';

import Link from 'next/link';
import { useState, useActionState } from 'react';
import { createVehicle, type ActionResponse } from '@/app/lib/actions';

export default function VesselClient({
  vehicles,
  totalPages,
  currentPage,
  query,
  status,
  previousPageUrl,
  nextPageUrl,
  deleteAction,
}: {
  vehicles: any[];
  totalPages: number;
  currentPage: number;
  query: string;
  status: string;
  previousPageUrl: string;
  nextPageUrl: string;
  deleteAction: (vehicleId: string) => Promise<void>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    createVehicle,
    { success: false }
  );

  if (state?.success && typeof window !== 'undefined') {
    setTimeout(() => {
      setIsModalOpen(false);
      window.location.reload();
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            All Vessels
          </h1>

          <div className="flex gap-4 mt-2">
            <form className="flex gap-4">
              <input type="hidden" name="query" value={query} />
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#bc66ff] hover:bg-[#a347ff] text-black font-black text-[10px] px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(188,102,255,0.4)]"
          >
            Register Vessel
          </button>
        </div>
      </div>

      {/* Modal Centered dengan Error Handling */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#110a1c] border border-[#bc66ff]/30 rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_60px_rgba(188,102,255,0.3)] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-black uppercase tracking-wider text-[#bc66ff] mb-6 text-center">
              Register New Vehicle
            </h2>

            {/* Global Error */}
            {state?.error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
                  ⚠️ {state.error}
                </p>
              </div>
            )}

            {/* Form dengan Error Handling per Field */}
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputWithState label="Vehicle Name" name="vehicleName" state={state} isPending={isPending} />
                <InputWithState label="Vehicle Code" name="vehicleCode" state={state} isPending={isPending} />
                <InputWithState label="Vehicle Type" name="vehicleType" state={state} isPending={isPending} />
                <InputWithState label="Capacity" name="capacity" state={state} isPending={isPending} />
                <SelectWithState
                  label="Status"
                  name="status"
                  options={['EN ROUTE', 'MAINTENANCE', 'IN PORT', 'ANCHORAGE']}
                  state={state}
                  isPending={isPending}
                />
                <InputWithState
                  label="Registry Status"
                  name="registryStatus"
                  defaultValue="2026-ACTIVE"
                  state={state}
                  isPending={isPending}
                />
                <InputWithState
                  label="Hull Integrity"
                  name="hullIntegrity"
                  defaultValue="OPTIMAL"
                  state={state}
                  isPending={isPending}
                  className="col-span-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/5 border border-white/10 py-3 rounded-full uppercase tracking-widest font-black text-[9px] hover:bg-white hover:text-black transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-[#bc66ff] hover:bg-[#a347ff] py-3 rounded-full uppercase tracking-widest font-black text-black transition-all text-[9px] disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
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
          <span className="absolute left-5 top-3 opacity-30 text-lg">🔍</span>
        </div>
        <button
          type="submit"
          className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          Search
        </button>
      </form>

      {/* Vessels Grid */}
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
                  {/* Delete - Trigger 404 Page */}
                    <Link
                    href="/dashboard/fleet/vessels/delete-not-implemented"
                    className="text-rose-500 hover:text-white"
                    onClick={(e) => {
                        e.preventDefault();
                        // Redirect ke halaman yang tidak ada → trigger app/not-found.tsx
                        window.location.href = '/dashboard/fleet/vessels/delete-not-implemented';
                    }}
                    >
                    Delete
                    </Link>
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

      {/* Pagination */}
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

// ✅ Input Component - HAPUS 'required'
function InputWithState({ 
  label, 
  name, 
  defaultValue, 
  state, 
  isPending,
  className 
}: { 
  label: string; 
  name: string; 
  defaultValue?: string;
  state?: any;
  isPending?: boolean;
  className?: string;
}) {
  const error = state?.fieldErrors?.[name]?.[0];
  
  return (
    <div className={className}>
      <label className="block text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-2">
        {label}
      </label>
      <input
        // ❌ HAPUS: required attribute
        name={name}
        defaultValue={defaultValue}
        disabled={isPending}
        className={`w-full bg-[#07040d] border rounded-xl p-3 outline-none font-bold text-white transition-all placeholder:text-gray-700 disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10 focus:border-[#bc66ff]'
        }`}
      />
      {/* ✅ Tampilkan error text dari server */}
      {error && (
        <p className="text-[8px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

// ✅ Select Component - HAPUS 'required' + TAMBAH placeholder
function SelectWithState({ 
  label, 
  name, 
  options, 
  state, 
  isPending 
}: { 
  label: string; 
  name: string; 
  options: string[];
  state?: any;
  isPending?: boolean;
}) {
  const error = state?.fieldErrors?.[name]?.[0];
  
  return (
    <div>
      <label className="block text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-2">
        {label}
      </label>
      <select
        //  HAPUS: required attribute
        name={name}
        disabled={isPending}
        className={`w-full bg-[#07040d] border rounded-xl p-3 outline-none font-bold text-gray-300 cursor-pointer transition-all disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10 focus:border-[#bc66ff]'
        }`}
      >
        {/* ✅ Tambah placeholder option */}
        <option value="">Select option</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#150e24]">
            {option}
          </option>
        ))}
      </select>
      {/* ✅ Tampilkan error text dari server */}
      {error && (
        <p className="text-[8px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
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