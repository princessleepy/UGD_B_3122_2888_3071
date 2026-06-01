'use client';

import Link from 'next/link';
import { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { createVehicle, type ActionResponse } from '@/app/lib/actions';

export default function CreateVesselPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    createVehicle,
    { success: false }
  );

  if (state?.success) {
    setTimeout(() => {
      router.push('/dashboard/fleet/vessels');
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Create Vehicle
          </h1>
          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1 uppercase">
            Register new vehicle data
          </p>
        </div>
        <Link
          href="/dashboard/fleet/vessels"
          className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          Back
        </Link>
      </div>

      <div className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
        {/* Global Error Alert */}
        {state?.error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
            <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
              ⚠️ {state.error}
            </p>
          </div>
        )}

        <form action={formAction} className="space-y-8">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
              Vehicle Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputWithState label="Vehicle Name" name="vehicleName" state={state} isPending={isPending} />
              <InputWithState label="Vehicle Code" name="vehicleCode" state={state} isPending={isPending} />
              <InputWithState label="Vehicle Type" name="vehicleType" state={state} isPending={isPending} />
              <InputWithState label="Capacity" name="capacity" state={state} isPending={isPending} />
            </div>
          </div>

          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
              Status & Registry
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                className="md:col-span-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/dashboard/fleet/vessels"
              className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
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
  className,
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
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>
      <input
        // ❌ HAPUS: required
        name={name}
        defaultValue={defaultValue}
        disabled={isPending}
        className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10'
        }`}
      />
      {/* ✅ Tampilkan error dari server */}
      {error && (
        <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

// ✅ Select Component - HAPUS 'required' + TAMBAH "Select option"
function SelectWithState({
  label,
  name,
  options,
  state,
  isPending,
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
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>
      <select
        // ❌ HAPUS: required
        name={name}
        disabled={isPending}
        className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10'
        }`}
      >
        {/* ✅ Placeholder option */}
        <option value="">Select option</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#150e24]">
            {option}
          </option>
        ))}
      </select>
      {/* ✅ Tampilkan error dari server */}
      {error && (
        <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}