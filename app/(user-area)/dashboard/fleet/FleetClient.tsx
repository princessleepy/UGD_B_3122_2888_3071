'use client';

import React, { useState } from 'react';
import { Vehicle, VehicleStats } from '@/app/lib/definitions';
import { getVehicleEta, getVehicleLocation, timeAgo } from '@/app/lib/utils';

function buildFleetStats(stats: VehicleStats) {
  return [
    {
      label: 'VESSELS EN ROUTE',
      value: String(stats.enRoute).padStart(2, '0'),
      sub: '+3%',
      subColor: 'text-emerald-400',
    },
    {
      label: 'IN PORT',
      value: String(stats.inPort).padStart(2, '0'),
      sub: 'STABLE',
      subColor: 'text-gray-600',
    },
    {
      label: 'ANCHORAGE',
      value: String(stats.anchorage).padStart(2, '0'),
      sub: 'WAITING',
      subColor: 'text-amber-500',
    },
    {
      label: 'MAINTENANCE',
      value: String(stats.maintenance).padStart(2, '0'),
      sub: 'ALERT',
      subColor: 'text-rose-500',
    },
  ];
}

export default function FleetClient({
  vehicles,
  stats,
}: {
  vehicles: Vehicle[];
  stats: VehicleStats;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(vehicles.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVessels = vehicles.slice(startIndex, startIndex + itemsPerPage);
  const dashboardStats = buildFleetStats(stats);

  return (
    <div className="min-h-screen bg-[#0d0415] text-white p-6 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#1a0b2e] p-5 rounded-[20px] border border-white/5"
          >
            <p className="text-[9px] text-gray-500 mb-2 uppercase font-bold tracking-[0.2em]">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">{stat.value}</span>
              <span className={`text-[9px] font-bold ${stat.subColor}`}>
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold tracking-[0.25em] text-white uppercase italic">
            Fleet Overview
          </h2>
          <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">
            Page {currentPage} / {totalPages}
          </span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white/5 text-[9px] text-gray-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-4">Vessel</th>
              <th className="px-8 py-4">Location</th>
              <th className="px-8 py-4">ETA</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedVessels.map((v) => (
              <tr key={v.id}>
                <td className="px-8 py-5 text-[#bc66ff] font-black uppercase">
                  {v.vehicle_name}
                </td>
                <td className="px-8 py-5 text-gray-400">
                  {getVehicleLocation(v.status)}
                </td>
                <td className="px-8 py-5">{getVehicleEta(v.status)}</td>
                <td className="px-8 py-5 text-center">{v.status}</td>
                <td className="px-8 py-5 text-right text-gray-500 uppercase">
                  {v.updated_at ? timeAgo(v.updated_at) : 'Just now'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vehicles.length === 0 && (
          <div className="py-12 text-center text-gray-600 font-black uppercase tracking-widest text-[10px]">
            No vessel data found
          </div>
        )}

        <div className="flex justify-center gap-3 px-8 py-6 border-t border-white/5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-all"
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
            className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
