'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { UserDashboardSkeleton } from '@/app/ui/skeletons';
import {
  deleteSchedule,
  fetchAllVehiclesAction,
  fetchMaintenanceSchedulesAction,
  saveSchedule,
  type ActionResponse,
} from '@/app/lib/actions';

type ScheduleStatus = "PLANNED" | "IN_PROGRESS" | "DONE";

interface ScheduleItem {
  id: string;
  vessel_id: string;
  vesselName: string;
  task: string;
  date: string;
  status: ScheduleStatus;
}

interface MaintenanceItem {
  id: string;
  vessel_id: string;
  name: string;
  health: number;
  issueType: string;
}

interface VehicleItem {
  id: string;
  vehicle_name: string;
}

const taskOptions = ["Engine Oil Change", "Propeller Check", "Hull Cleaning", "Engine Overhaul", "Electrical Repair"];

export default function MaintenancePage() {
  useEffect(() => {
    document.title = 'Maintenance Schedule | PT. Samudra Technology Nusantara';
  }, []);

  const [maintenanceData, setMaintenanceData] = useState<MaintenanceItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    saveSchedule,
    { success: false }
  );

  const [formData, setFormData] = useState({
    id: '',
    vessel_id: '',
    vesselName: '',
    task: '',
    date: '',
    status: 'PLANNED' as ScheduleStatus
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const loadData = async () => {
    const [vehicleRows, scheduleRows] = await Promise.all([
      fetchAllVehiclesAction(),
      fetchMaintenanceSchedulesAction(),
    ]);
    const vehicleData = vehicleRows as unknown as VehicleItem[];
    const scheduleData = scheduleRows as any[];

    setVehicles(vehicleData);
    setSchedules(scheduleData.map((item) => ({
      id: item.id,
      vessel_id: item.vessel_id,
      vesselName: item.vehicle_name,
      task: item.task,
      date: String(item.maintenance_date).slice(0, 10),
      status: item.status,
    })));
    setMaintenanceData(vehicleData.map((item) => {
      const active = scheduleData.find((s) => s.vessel_id === item.id && s.status !== 'DONE');
      return {
        id: item.id,
        vessel_id: item.id,
        name: item.vehicle_name,
        health: active ? 45 : 100,
        issueType: active?.task || 'No Issue'
      };
    }));
    setIsMounted(true);
  };

  useEffect(() => {
    loadData().catch(() => setIsMounted(true));
  }, []);

  useEffect(() => {
    if (state.success) {
      // Panggil loadData() untuk menarik data terbaru dari database
      loadData().then(() => {
        // Reset form setelah data baru berhasil dimuat
        setFormData({ id: '', vessel_id: '', vesselName: '', task: '', date: '', status: 'PLANNED' });
        setIsEditing(false);
      });
    }
  }, [state.success]);

  // Di dalam komponen MaintenancePage (page.tsx)
useEffect(() => {
  if (maintenanceData.length === 0) return;

  const interval = setInterval(() => {
    setMaintenanceData((prevData) =>
      prevData.map((item) => {
        // 1. Logika penurunan kesehatan (di sini diset 1 menit sekali)
        if (item.health <= 0) return { ...item, health: 0 };
        const pengurangan = Math.random() * 2.0 + 0.5; 
        const newHealth = Math.max(0, item.health - pengurangan);
        const roundedHealth = parseFloat(newHealth.toFixed(2));

        // 2. Ambil status saat ini
        let currentNeed = (item as any).neededAction || item.issueType || "NO ISSUE";

        // 3. LOGIKA OTOMATIS: 
        // Jika health di bawah 70 dan status masih "NO ISSUE", ganti dengan task acak
        if (roundedHealth < 70 && currentNeed.toUpperCase() === "NO ISSUE") {
          const randomIndex = Math.floor(Math.random() * taskOptions.length);
          currentNeed = taskOptions[randomIndex];
        } 
        // Jika health kembali di atas 70, reset ke "NO ISSUE"
        else if (roundedHealth >= 70) {
          currentNeed = "NO ISSUE";
        }

        return {
          ...item,
          health: roundedHealth,
          neededAction: currentNeed // Simpan status tugas otomatis di sini
        };
      })
    );
  }, 60000); // 1 menit

  return () => clearInterval(interval);
}, [maintenanceData.length]);

  const paginatedData = maintenanceData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(maintenanceData.length / itemsPerPage);

  const cancelEdit = () => {
    setFormData({ id: '', vessel_id: '', vesselName: '', task: '', date: '', status: 'PLANNED' });
    setIsEditing(false);
  };

  if (!isMounted) return <UserDashboardSkeleton />;

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      vessel_id: item.vessel_id,
      vesselName: item.vesselName,
      task: item.task,
      date: item.date || item.maintenance_date, // Sesuaikan dengan field di DB Anda
      status: item.status
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus jadwal ini?");
    if (!confirmDelete) return;

    const result = await deleteSchedule(id); 
    if (result.success) {
      await loadData(); // Fungsi untuk refresh data dari database
    } else {
      alert("Gagal menghapus: " + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-12 space-y-12">
      <div className="grid grid-cols-4 gap-4">
        {[
            {l: 'FLEET HEALTH', v: `${maintenanceData.length ? Math.round(maintenanceData.reduce((acc, item) => acc + item.health, 0) / maintenanceData.length) : 0}%`},
            {l: 'ACTIVE', v: schedules.filter(s => s.status === 'IN_PROGRESS').length},
            {l: 'PLANNED', v: schedules.filter(s => s.status === 'PLANNED').length},
            {l: 'COMPLETED', v: schedules.filter(s => s.status === 'DONE').length}
        ].map((s, i) => (
          <div key={i} className="bg-[#150e24] p-4 rounded-xl border border-white/10">
            <p className="text-[8px] text-gray-500 tracking-wider">{s.l}</p>
            <p className="text-lg font-bold mt-1">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-7 bg-[#150e24] rounded-[3rem] p-10 border border-white/10 space-y-6">
          <h2 className="text-[12px] uppercase text-gray-400 tracking-widest mb-6">Fleet Health Monitoring</h2>
          {paginatedData.map(m => {
            // Cari jadwal yang aktif untuk kapal ini
            const active = schedules.find(s => s.vessel_id === m.id);
            const currentHealth = m.health;
            const displayIssue = (m as any).neededAction || m.issueType || "NO ISSUE";

            return (
              <div key={m.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-white/20 transition-all">
                {/* HEADER: Nama Kapal & Status Kesehatan */}
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white tracking-wider">{m.name}</h3>
                  <span className={`text-[10px] font-black px-2 py-1 rounded ${m.health < 70 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {Math.round(m.health)}% HEALTH
                  </span>
                </div>

                {/* PROGRESS BAR */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-[2000ms] ${m.health < 40 ? 'bg-rose-500' : m.health < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${m.health}%` }}
                  />
                </div>

                {/* DETAIL JADWAL & AKSI (Dimasukkan ke sini!) */}
                {active ? (
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                    <div className="space-y-0.5 text-gray-400">
                      <p><span className="text-white font-bold">DATE:</span> {new Date(active.date).toLocaleDateString()}</p>
                      <p><span className="text-white font-bold">TASK:</span> {active.task}</p>
                      <p>
                        <span className="text-white font-bold">STATUS: </span>
                        <span className={`px-2 py-0.5 rounded uppercase font-bold ${
                          active.status === 'DONE' ? 'bg-emerald-500/20 text-emerald-400' :
                          active.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {active.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(active)} className="text-blue-400 hover:text-white font-bold">EDIT</button>
                      <button onClick={() => handleDelete(active.id)} className="text-rose-500 hover:text-white font-bold">DELETE</button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/5 text-[10px] text-emerald-500 font-bold italic">
                    * SYSTEM OPERATIONAL - NO PENDING TASKS
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-center gap-6 pt-6 border-t border-white/10">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="text-[11px] hover:text-[#bc66ff]">Prev</button>
            <span className="text-[11px] text-gray-500">{currentPage} / {totalPages || 1}</span>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="text-[11px] hover:text-[#bc66ff]">Next</button>
          </div>
        </div>

        <div className="col-span-5 bg-[#150e24] rounded-[3rem] p-10 border border-white/10 space-y-6">
          <h2 className="text-[12px] uppercase text-gray-400 tracking-widest">Service Scheduler</h2>
          <form action={formAction} className="space-y-4">
            {/* Hidden fields — these are what the server action actually reads */}
            <input type="hidden" name="id"        value={formData.id || 'new'} />
            <input type="hidden" name="vessel_id" value={formData.vessel_id}   />
            <input type="hidden" name="task"      value={formData.task}        />
            <input type="hidden" name="status"    value={formData.status}      />
            <input type="hidden" name="date"      value={formData.date}        />

            {/* Vessel dropdown — drives hidden field via onChange */}
            <div>
              <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Vessel</label>
              <select
                className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10 focus:border-[#bc66ff] outline-none"
                value={formData.vessel_id}
                onChange={e => {
                  const vehicle = vehicles.find(v => v.id === e.target.value);
                  setFormData({ ...formData, vessel_id: e.target.value, vesselName: vehicle?.vehicle_name || '' });
                }}
              >
                <option value="">— Select Vessel —</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.vehicle_name}</option>
                ))}
              </select>
              {state?.fieldErrors?.vessel_id && (
                <p className="text-rose-500 text-[9px] font-bold mt-1">⚠️ {state.fieldErrors.vessel_id[0]}</p>
              )}
            </div>

            {/* Task dropdown */}
            <div>
              <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Task</label>
              <select
                className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10 focus:border-[#bc66ff] outline-none"
                value={formData.task}
                onChange={e => setFormData({ ...formData, task: e.target.value })}
              >
                <option value="">— Select Task —</option>
                {taskOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {state?.fieldErrors?.task && (
                <p className="text-rose-500 text-[9px] font-bold mt-1">⚠️ {state.fieldErrors.task[0]}</p>
              )}
            </div>

            {/* Status dropdown */}
            <div>
              <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Status</label>
              <select
                className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10 focus:border-[#bc66ff] outline-none"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ScheduleStatus })}
              >
                <option value="PLANNED">PLANNED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            {/* Date input */}
            <div>
              <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Date</label>
              <input
                type="date"
                className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10 focus:border-[#bc66ff] outline-none"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
              {state?.fieldErrors?.date && (
                <p className="text-rose-500 text-[9px] font-bold mt-1">⚠️ {state.fieldErrors.date[0]}</p>
              )}
            </div>

            {/* Error banner */}
            {state?.error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <p className="text-rose-400 text-[9px] font-bold uppercase">⚠️ {state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#bc66ff] text-black py-4 rounded-xl font-black text-[11px] uppercase tracking-widest disabled:opacity-50"
            >
              {isPending ? 'SAVING...' : isEditing ? 'UPDATE SCHEDULE' : 'SAVE SCHEDULE'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full mt-2 bg-transparent border border-white/10 text-gray-400 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest"
              >
                CANCEL EDIT
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
