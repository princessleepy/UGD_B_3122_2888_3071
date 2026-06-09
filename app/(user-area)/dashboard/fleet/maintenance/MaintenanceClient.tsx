'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStats } from '@/app/lib/definitions';
import { UserDashboardSkeleton } from '@/app/ui/skeletons';

type ScheduleStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE';

interface ScheduleItem {
  id: string;
  vesselName: string;
  task: string;
  date: string;
  status: ScheduleStatus;
}

const taskOptions = [
  'Engine Oil Change',
  'Propeller Check',
  'Hull Cleaning',
  'Engine Overhaul',
  'Electrical Repair',
];

export default function MaintenanceClient({
  maintenanceVessels,
  stats,
}: {
  maintenanceVessels: Pick<
    Vehicle,
    'vehicle_name' | 'vehicle_code' | 'status' | 'updated_at'
  >[];
  stats: VehicleStats;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    vesselName: '',
    task: '',
    date: '',
    status: 'PLANNED' as ScheduleStatus,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const maintenanceData = maintenanceVessels.map((v, index) => ({
    id: String(index),
    name: v.vehicle_name,
    health: 30 + (index % 3) * 15,
    issueType: taskOptions[index % taskOptions.length],
  }));

  useEffect(() => {
    document.title = 'Maintenance Schedule | PT. Samudra Technology Nusantara';
    setIsMounted(true);
  }, []);

  const paginatedData = maintenanceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(maintenanceData.length / itemsPerPage) || 1;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setSchedules(schedules.map((s) => (s.id === formData.id ? formData : s)));
    } else {
      setSchedules([...schedules, { ...formData, id: Date.now().toString() }]);
    }
    setFormData({ id: '', vesselName: '', task: '', date: '', status: 'PLANNED' });
    setIsEditing(false);
  };

  if (!isMounted) return <UserDashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-12 space-y-12">
      <div className="grid grid-cols-4 gap-4">
        {[
          { l: 'FLEET HEALTH', v: `${stats.readiness}%` },
          { l: 'ACTIVE', v: stats.maintenance },
          { l: 'PLANNED', v: schedules.filter((s) => s.status === 'PLANNED').length },
          { l: 'COMPLETED', v: schedules.filter((s) => s.status === 'DONE').length },
        ].map((s, i) => (
          <div key={i} className="bg-[#150e24] p-4 rounded-xl border border-white/10">
            <p className="text-[8px] text-gray-500 tracking-wider">{s.l}</p>
            <p className="text-lg font-bold mt-1">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-7 bg-[#150e24] rounded-[3rem] p-10 border border-white/10 space-y-6">
          <h2 className="text-[12px] uppercase text-gray-400 tracking-widest mb-6">
            Fleet Health Monitoring
          </h2>
          {paginatedData.map((m) => {
            const active = schedules.find(
              (s) => s.vesselName.toLowerCase() === m.name.toLowerCase(),
            );
            const currentHealth = active?.status === 'DONE' ? 100 : m.health;

            return (
              <div
                key={m.id}
                className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4"
              >
                <div className="flex justify-between text-[11px] uppercase font-bold">
                  <p>
                    {m.name}
                    {currentHealth < 50 && (
                      <span className="text-rose-500 ml-2">({m.issueType})</span>
                    )}
                    {active && (
                      <span className="ml-4 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                        {active.status}
                      </span>
                    )}
                  </p>
                  <p
                    className={
                      currentHealth === 100 ? 'text-blue-400' : 'text-green-500'
                    }
                  >
                    {currentHealth}% Health
                  </p>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${currentHealth === 100 ? 'bg-blue-500' : 'bg-green-500'}`}
                    style={{ width: `${currentHealth}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex justify-center gap-6 pt-6 border-t border-white/10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="text-[11px] hover:text-[#bc66ff] disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-[11px] text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="text-[11px] hover:text-[#bc66ff] disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>

        <div className="col-span-5 bg-[#150e24] rounded-[3rem] p-10 border border-white/10 space-y-6">
          <h2 className="text-[12px] uppercase text-gray-400 tracking-widest">
            Service Scheduler
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10"
              placeholder="Vessel Name"
              value={formData.vesselName}
              onChange={(e) =>
                setFormData({ ...formData, vesselName: e.target.value })
              }
            />
            <select
              className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            >
              <option value="">Select Task</option>
              {taskOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ScheduleStatus,
                })
              }
            >
              <option value="PLANNED">PLANNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            <input
              type="date"
              className="w-full bg-black/40 p-4 rounded-xl text-sm border border-white/10"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-[#bc66ff] text-black py-4 rounded-xl font-black text-[11px] uppercase tracking-widest"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </form>

          <div className="mt-8 space-y-3 max-h-[300px] overflow-y-auto">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="p-5 bg-white/5 rounded-2xl text-[10px] flex justify-between items-center border border-white/5"
              >
                <div>
                  <p className="font-bold text-xs">{s.vesselName}</p>
                  <p className="text-gray-400">
                    {s.task} • {s.date} • {s.status}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setFormData(s);
                      setIsEditing(true);
                    }}
                    className="text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setSchedules(schedules.filter((item) => item.id !== s.id))
                    }
                    className="text-rose-500"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
