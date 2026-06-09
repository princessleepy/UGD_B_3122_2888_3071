'use client';

import React, { useState } from 'react';
import { Vehicle, VehicleStats } from '@/app/lib/definitions';
import MaintenanceMetricCard from '@/components/analytics/MetricCard';

export default function FleetAnalyticsClient({
  stats,
  statusDistribution,
  maintenanceVessels,
}: {
  stats: VehicleStats;
  statusDistribution: { active: number; critical: number; planned: number };
  maintenanceVessels: Pick<Vehicle, 'vehicle_name' | 'vehicle_code' | 'status'>[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const tableData = maintenanceVessels.map((v) => ({
    name: v.vehicle_name,
    status: 'CRITICAL' as const,
    progress: 40,
    eta: 'IN PROGRESS',
    failure: 'Scheduled Maintenance',
  }));
  const totalPages = Math.ceil(tableData.length / itemsPerPage) || 1;
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const readiness = Number(stats.readiness);
  const statusSummary = [
    { label: 'ACTIVE', color: 'bg-[#bc66ff]', count: statusDistribution.active },
    { label: 'CRITICAL', color: 'bg-rose-500', count: statusDistribution.critical },
    { label: 'PLANNED', color: 'bg-indigo-400', count: statusDistribution.planned },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0514] text-white font-mono p-6 lg:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-white">
            Fleet Analytics
          </h1>
          <p className="text-[10px] text-[#bc66ff] font-black tracking-[0.4em] mt-3 uppercase opacity-80">
            Aqualynx Command Center // Maintenance Hub
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <p className="text-[8px] text-white/30 font-black uppercase mb-1">
              Fleet Sync
            </p>
            <p className="text-[10px] font-bold text-emerald-400 animate-pulse">
              ONLINE // LIVE
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MaintenanceMetricCard
          title="Overall Readiness"
          value={`${stats.readiness}%`}
          progress={readiness}
          status="GLOBAL"
        />
        <MaintenanceMetricCard
          title="Monitored Units"
          value={String(stats.total)}
          subtitle="TOTAL FLEET"
          status="VESSELS"
        />
        <MaintenanceMetricCard
          title="Critical Alerts"
          value={String(stats.maintenance)}
          status={stats.maintenance > 0 ? 'ACTION REQ' : 'CLEAR'}
          statusType={stats.maintenance > 0 ? 'warning' : 'optimal'}
        />
        <MaintenanceMetricCard
          title="Completed Tasks"
          value="0"
          subtitle="RECENT LOGS"
          status="UNITS"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#150e24]/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <h3 className="text-[12px] font-black uppercase tracking-widest text-white/60">
                Vessel Maintenance Status
              </h3>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-2">
                Page {currentPage} / {totalPages}
              </p>
            </div>
            <span className="text-[9px] bg-[#bc66ff]/20 text-[#bc66ff] px-4 py-1.5 rounded-full font-black tracking-tighter border border-[#bc66ff]/30">
              LIVE_TRACKING
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-white/20 uppercase font-black border-b border-white/5">
                  <th className="px-8 py-5">Vessel Name</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Maintenance Progress</th>
                  <th className="px-8 py-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedData.map((ship, i) => (
                  <tr
                    key={`${ship.name}-${i}`}
                    className="hover:bg-white/[0.03] transition-all group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-[13px] font-black text-white group-hover:text-[#bc66ff] transition-colors">
                        {ship.name}
                      </p>
                      <p className="text-[9px] text-white/30 uppercase mt-1 tracking-tighter">
                        {ship.failure}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[9px] px-3 py-1.5 rounded-lg border font-black tracking-widest bg-rose-500/10 text-rose-500 border-rose-500/20">
                        {ship.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden min-w-[100px]">
                          <div
                            className="h-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                            style={{ width: `${ship.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-white/60">
                          {ship.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-[11px] font-black text-[#bc66ff] tracking-tighter uppercase">
                        {ship.eta}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-3 px-8 py-6 border-t border-white/5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 transition-all"
            >
              Prev
            </button>
            <div className="px-5 py-2 rounded-full bg-black/30 border border-white/10 text-[10px] uppercase tracking-widest text-white/60 font-black">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#150e24] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center shadow-2xl relative overflow-hidden">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-10 self-start text-center w-full">
              Readiness Score
            </h3>
            <div className="relative w-52 h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#bc66ff"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(readiness / 100) * 264} 264`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter text-white">
                  {stats.readiness}%
                </span>
                <span className="text-[9px] text-[#bc66ff] font-black uppercase tracking-[0.2em] mt-1">
                  Fleet Score
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-8">
              Status Distribution
            </h3>
            <div className="space-y-6">
              {statusSummary.map((stat, i) => {
                const perc =
                  stats.total > 0 ? (stat.count / stats.total) * 100 : 0;
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between text-[10px] mb-2 font-black tracking-widest">
                      <span className="text-white/40 group-hover:text-white transition-colors">
                        {stat.label}
                      </span>
                      <span className="text-white">{stat.count} UNITS</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${stat.color}`}
                        style={{ width: `${perc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500">
              Export Fleet Log (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
