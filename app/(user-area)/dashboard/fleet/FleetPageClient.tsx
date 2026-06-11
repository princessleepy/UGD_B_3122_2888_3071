'use client';

import React, { useState } from 'react';

function getStatusColor(status: string) {
  switch ((status ?? '').toUpperCase()) {
    case 'EN ROUTE':    return 'text-emerald-400';
    case 'IN PORT':     return 'text-indigo-400';
    case 'ANCHORAGE':   return 'text-amber-400';
    case 'MAINTENANCE': return 'text-rose-400';
    default:            return 'text-gray-400';
  }
}

function getStatusBg(status: string) {
  switch ((status ?? '').toUpperCase()) {
    case 'EN ROUTE':    return 'bg-emerald-400/10 border-emerald-400/30';
    case 'IN PORT':     return 'bg-indigo-400/10 border-indigo-400/30';
    case 'ANCHORAGE':   return 'bg-amber-400/10 border-amber-400/30';
    case 'MAINTENANCE': return 'bg-rose-400/10 border-rose-400/30';
    default:            return 'bg-white/5 border-white/10';
  }
}

interface FleetStats {
  total: number;
  en_route: number;
  in_port: number;
  anchorage: number;
  maintenance: number;
  readiness: number;
}

export default function FleetPageClient({
  vehicles,
  stats,
}: {
  vehicles: any[];
  stats: FleetStats;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVessels = vehicles.slice(startIndex, startIndex + itemsPerPage);

  const statCards = [
    { label: 'VESSELS EN ROUTE', value: stats.en_route,    sub: 'ACTIVE',   color: 'text-emerald-400' },
    { label: 'IN PORT',          value: stats.in_port,     sub: 'DOCKED',   color: 'text-indigo-400'  },
    { label: 'ANCHORAGE',        value: stats.anchorage,   sub: 'WAITING',  color: 'text-amber-400'   },
    { label: 'MAINTENANCE',      value: stats.maintenance, sub: 'SERVICE',  color: 'text-rose-400'    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0415] text-white p-6 font-mono">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#1a0b2e] p-5 rounded-[20px] border border-white/5">
            <p className="text-[9px] text-gray-500 mb-2 uppercase font-bold tracking-[0.2em]">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
              <span className={`text-[9px] font-bold ${stat.color}`}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet readiness banner */}
      <div className="mb-6 bg-[#1a0b2e] rounded-2xl border border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#bc66ff] animate-pulse" />
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            Fleet Readiness
          </span>
        </div>
        <span className="text-xl font-black text-[#bc66ff]">
          {stats.readiness}%
          <span className="text-[9px] text-gray-500 font-bold ml-2 tracking-widest">
            ({stats.total - stats.maintenance}/{stats.total} VESSELS OPERATIONAL)
          </span>
        </span>
      </div>

      {/* TABLE */}
      <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold tracking-[0.25em] text-white uppercase italic">
            Fleet Overview
          </h2>
          <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">
            {vehicles.length} VESSELS · Page {currentPage} / {totalPages || 1}
          </span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white/5 text-[9px] text-gray-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-4">Vessel</th>
              <th className="px-8 py-4">Type</th>
              <th className="px-8 py-4">Capacity</th>
              <th className="px-8 py-4">Registry</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4">Hull</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedVessels.map((v) => (
              <tr key={v.id} className="hover:bg-[#bc66ff]/5 transition-all group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="font-black text-[11px] group-hover:text-[#bc66ff] transition-colors uppercase">
                    {v.vehicle_name}
                  </div>
                  <div className="text-[9px] text-gray-600 font-bold tracking-tighter mt-0.5 uppercase">
                    ID: {v.vehicle_code}
                  </div>
                </td>
                <td className="px-8 py-5 text-[10px] font-bold text-gray-300 uppercase">
                  {v.vehicle_type}
                </td>
                <td className="px-8 py-5 text-[10px] text-gray-400 font-bold">
                  {Number(v.capacity).toLocaleString()} DWT
                </td>
                <td className="px-8 py-5 text-[10px] text-gray-500 font-bold uppercase">
                  {v.registry_status}
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-center">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBg(v.status)} ${getStatusColor(v.status)}`}>
                      {v.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-[10px] text-gray-400 font-bold uppercase">
                  {v.hull_integrity}
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
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 transition-all"
          >
            Prev
          </button>
          <div className="px-5 py-2 rounded-full bg-black/30 border border-white/10 text-[10px] uppercase tracking-widest text-white/60 font-black">
            {currentPage} / {totalPages || 1}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
