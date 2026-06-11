'use client';

import Link from 'next/link';
import { useState, useActionState, useEffect } from 'react';
import { createVessel, updateVehicle, type ActionResponse } from '@/app/lib/actions';

export default function VesselClient({
  vehicles,
  totalPages,
  currentPage,
  query,
  status,
  previousPageUrl,
  nextPageUrl,
  deleteAction,
  nextVehicleCode,
  cargoTypes,
}: {
  vehicles: any[];
  totalPages: number;
  currentPage: number;
  query: string;
  status: string;
  previousPageUrl: string;
  nextPageUrl: string;
  deleteAction: (vehicleId: string) => Promise<ActionResponse>;
  nextVehicleCode: string;
  cargoTypes: string[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'create' | 'update' | 'delete' } | null>(null);
  
  // 🛠️ PENGGABUNGAN ACTION: Otomatis memilah antara Create atau Update 
  const handleSubmitAction = async (prevState: ActionResponse, formData: FormData) => {
    if (editingVehicle) {
      return updateVehicle(prevState, formData);
    }
    return createVessel(prevState, formData);
  };

  // ✅ HANYA ADA SATU DEKLARASI useActionState DI SINI
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    handleSubmitAction,
    { success: false }
  );

  useEffect(() => {
    if (state?.success) {
      // Tentukan jenis pesan berdasarkan status apakah sedang edit atau registrasi baru
      const isEdit = !!editingVehicle;
      
      setToast({
        message: isEdit ? 'VEHICLE UPDATED SUCCESSFULLY' : 'NEW VEHICLE CREATED SUCCESSFULLY',
        type: isEdit ? 'update' : 'create'
      });

      // Beri jeda 2 detik agar animasi Toast muncul penuh, lalu refresh halaman
      const timer = setTimeout(() => {
        setIsModalOpen(false);
        setEditingVehicle(null);
        setToast(null);
        window.location.reload();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state?.success]);
  

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
            onClick={() => {
              setEditingVehicle(null); // Reset mode jika sebelumnya habis klik edit
              setIsModalOpen(true);
            }}
            className="bg-[#bc66ff] hover:bg-[#a347ff] text-black font-black text-[10px] px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(188,102,255,0.4)]"
          >
            Register Vessel
          </button>
        </div>
      </div>

      {/* Modal Box */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#110a1c] border border-[#bc66ff]/30 rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_60px_rgba(188,102,255,0.3)] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingVehicle(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-black uppercase tracking-wider text-[#bc66ff] mb-6 text-center">
              {editingVehicle ? 'Update Vehicle Data' : 'Register New Vehicle'}
            </h2>

            {/* Global Error Banner */}
            {state?.error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
                  ⚠️ {state.error}
                </p>
              </div>
            )}

            {/* 🔥 FIX UTAMA: Menambahkan properti 'key' yang dinamis agar form merender ulang data defaultValue baru */}
            <form 
              key={editingVehicle ? `edit-${editingVehicle.id}` : 'register-form'} // 🛠️ Biarkan string key tetap konsisten selama modal terbuka
              action={formAction} 
              className="space-y-4"
            >
              {/* Kirim ID secara tersembunyi jika dalam mode Edit */}
              {editingVehicle && <input type="hidden" name="id" value={editingVehicle.id} />}
              
              <input
                type="hidden"
                name="vehicleCode"
                value={editingVehicle ? editingVehicle.vehicle_code : nextVehicleCode}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Code Field */}
                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-2">
                    Vehicle Code
                  </label>
                  <input
                    value={editingVehicle ? editingVehicle.vehicle_code : nextVehicleCode}
                    readOnly
                    className="w-full bg-[#07040d] border border-white/10 rounded-xl p-3 font-bold text-[#bc66ff] cursor-not-allowed"
                  />
                </div>

                {/* 2. Vehicle Name */}
                <InputWithState
                  key={state?.data?.vehicleName ? `name-${state.data.vehicleName}` : 'name-init'}
                  label="Vehicle Name"
                  name="vehicleName"
                  defaultValue={state?.data?.vehicleName || (editingVehicle ? editingVehicle.vehicle_name : '')}
                  state={state}
                  isPending={isPending}
                />

                {/* 3. Vehicle Type */}
                <SelectWithState
                  key={state?.data?.vehicleType ? `type-${state.data.vehicleType}` : 'type-init'}
                  label="Vehicle Type"
                  name="vehicleType"
                  defaultValue={state?.data?.vehicleType || (editingVehicle ? editingVehicle.vehicle_type : '')}
                  options={cargoTypes}
                  state={state}
                  isPending={isPending}
                />

                {/* 4. Capacity */}
                <InputWithState
                  key={state?.data?.capacity ? `cap-${state.data.capacity}` : 'cap-init'}
                  label="Capacity"
                  name="capacity"
                  defaultValue={state?.data?.capacity || (editingVehicle ? editingVehicle.capacity : '')}
                  state={state}
                  isPending={isPending}
                />

                {/* 5. Status */}
                <SelectWithState
                  // 🛠️ FIX 1: Gunakan ID kendaraan sebagai KEY agar elemen Select di-reset total setiap kali ganti kapal yang diedit
                  key={editingVehicle ? `status-edit-${editingVehicle.id}-${editingVehicle.status}` : 'status-register'}
                  label="Status"
                  name="status"
                  // 🛠️ FIX 2: Ganti dari editingVehicle.vehicle_status menjadi editingVehicle.status
                  defaultValue={state?.data?.status || (editingVehicle ? editingVehicle.status : 'SELECT OPTION')}
                  options={['EN ROUTE', 'MAINTENANCE', 'IN PORT', 'ANCHORAGE']}
                  state={state}
                  isPending={isPending}
                />

                {/* 6. Registry Status */}
                <InputWithState
                  key={state?.data?.registryStatus ? `reg-${state.data.registryStatus}` : 'reg-init'}
                  label="Registry Status"
                  name="registryStatus"
                  defaultValue={state?.data?.registryStatus || (editingVehicle ? editingVehicle.registry_status : '')}
                  state={state}
                  isPending={isPending}
                />

                {/* 7. Hull Integrity */}
                <SelectWithState
                  key={state?.data?.hullIntegrity ? `hull-${state.data.hullIntegrity}` : 'hull-init'}
                  label="Hull Integrity"
                  name="hullIntegrity"
                  defaultValue={state?.data?.hullIntegrity || (editingVehicle ? editingVehicle.hull_integrity : 'SELECT OPTION')}
                  options={['OPTIMAL', 'GOOD', 'FAIR', 'CRITICAL']}
                  state={state}
                  isPending={isPending}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingVehicle(null);
                  }}
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

      {/* Search Input */}
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
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[7px] font-black tracking-widest uppercase ${getVehicleStatusColor(vehicle.status)}`}
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
                <div className="flex gap-3 text-[9px] font-black uppercase items-center">
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setIsModalOpen(true);
                    }}
                    className="text-[#bc66ff] hover:text-white font-bold"
                  >
                    EDIT
                  </button>

                  <button
                    onClick={async () => {
                      const confirmDelete = confirm(
                        `Hapus kendaraan ${vehicle.vehicle_name}?`
                      );
                      if (!confirmDelete) return;

                      // Menampung response dari server action
                      const res = await deleteAction(vehicle.id);
                      
                      if (res && !res.success) {
                        // Jika gagal (misal: Anda bukan Admin atau ID salah), tampilkan alasannya
                        alert(`Gagal menghapus: ${res.error || 'Terjadi kesalahan'}`);
                      } else {
                        // 🟢 Pemicu toast hapus yang baru
                        setToast({
                          message: 'VEHICLE DELETED FROM DATABASE',
                          type: 'delete'
                        });
                        
                        // Beri delay 2 detik agar user bisa membaca toast merahnya sebelum halaman reload
                        setTimeout(() => {
                          setToast(null);
                          window.location.reload();
                        }, 2000);
                      }
                    }}
                    className="text-rose-500 hover:text-white font-bold"
                  >
                    DELETE
                  </button>
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
                  {vehicle.status === 'MAINTENANCE' ? 'UNDER REPAIR' : 'ACTIVE'}
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
          scroll={false}
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
          scroll={false}
          className={`px-5 py-2 rounded-full border border-white/10 text-xs uppercase hover:border-[#bc66ff] ${
            currentPage >= totalPages ? 'pointer-events-none opacity-30' : ''
          }`}
        >
          Next
        </Link>
      </div>

      {/* ================= TOAST NOTIFICATION SYSTEM ================= */}
      {/* ================= TOAST NOTIFICATION SYSTEM ================= */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce flex flex-col items-end">
          <div className={`bg-[#0f0a1c] border p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] transition-all duration-300 ${
            toast.type === 'create' ? 'border-emerald-500/40 shadow-emerald-500/10' :
            toast.type === 'update' ? 'border-indigo-500/40 shadow-indigo-500/10' :
            'border-rose-500/40 shadow-rose-500/10'
          }`}>
            
            {/* Ikon Dinamis berdasarkan Tipe */}
            <div className={`p-2 rounded-xl ${
              toast.type === 'create' ? 'bg-emerald-500/20 text-emerald-400' :
              toast.type === 'update' ? 'bg-indigo-500/20 text-indigo-400' :
              'bg-rose-500/20 text-rose-400'
            }`}>
              {toast.type === 'create' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
              {toast.type === 'update' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                </svg>
              )}
              {toast.type === 'delete' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </div>

            {/* Konten Teks */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                {toast.type === 'create' ? 'Fleet Registry' : toast.type === 'update' ? 'Fleet Sync' : 'Fleet Purge'}
              </h4>
              <p className={`text-[10px] uppercase font-black tracking-widest mt-0.5 ${
                toast.type === 'create' ? 'text-emerald-400' :
                toast.type === 'update' ? 'text-indigo-400' :
                'text-rose-400'
              }`}>
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}

// Tempelkan di paling bawah file VesselClient.tsx (di luar export default)

function getVehicleStatusColor(status: string) {
  if (!status) return 'border-white text-white bg-transparent';

  switch (status.toUpperCase()) {
    case 'IN PORT': 
      // ✅ Border putih, BG transparan, Teks tetap UNGU 500 murni + bayangan ungu lembut
      return 'border-white text-purple-500 bg-transparent shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      
    case 'EN ROUTE': 
      // ✅ Border putih, BG transparan, Teks tetap INDIGO 500 + bayangan indigo lembut
      return 'border-white text-indigo-500 bg-transparent shadow-[0_0_10px_rgba(99,102,241,0.2)]';
      
    case 'MAINTENANCE': 
      // ✅ Border putih, BG transparan, Teks tetap AMBER 500 + bayangan amber lembut
      return 'border-white text-amber-500 bg-transparent shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      
    case 'ANCHORAGE': 
      // ✅ Border putih, BG transparan, Teks tetap FUCHSIA 500 + bayangan fuchsia lembut
      return 'border-white text-fuchsia-500 bg-transparent shadow-[0_0_10px_rgba(232,121,249,0.2)]';
      
    default: 
      return 'border-white/40 text-gray-400 bg-transparent';
  }
}

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
        name={name}
        defaultValue={defaultValue}
        disabled={isPending}
        className={`w-full bg-[#07040d] border rounded-xl p-3 outline-none font-bold text-white transition-all placeholder:text-gray-700 disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10 focus:border-[#bc66ff]'
        }`}
      />
      {error && (
        <p className="text-[8px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectWithState({ 
  label, 
  name, 
  options, 
  defaultValue,
  state, 
  isPending 
}: { 
  label: string; 
  name: string; 
  options: string[];
  defaultValue?: string;
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
        name={name}
        defaultValue={defaultValue}
        disabled={isPending}
        className={`w-full bg-[#07040d] border rounded-xl p-3 outline-none font-bold text-gray-300 cursor-pointer transition-all disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10 focus:border-[#bc66ff]'
        }`}
      >
        <option value="">Select option</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#150e24]">
            {option}
          </option>
        ))}
      </select>
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