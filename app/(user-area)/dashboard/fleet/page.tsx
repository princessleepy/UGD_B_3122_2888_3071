'use client';
import React from 'react';
import { dashboardStats, vesselData } from "@/app/lib/placeholder-data";

export default function FleetOverview() {
  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 flex flex-col gap-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {dashboardStats.map((s, i) => (
          <div key={i} className="bg-[#150e24] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-[#bc66ff]/20 transition-all">
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-3">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black">{s.value}</p>
              <p className={`text-[9px] font-bold ${s.subColor}`}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-grow flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/80">Active Fleet Overview</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 bg-[#bc66ff]/5 px-3 py-1 rounded-full border border-[#bc66ff]/20">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[8px] font-black tracking-widest uppercase text-[#bc66ff]">Live Sync</span>
            </button>
            <button className="text-gray-600 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-[#150e24]/30 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto"> 
            <table className="w-full text-left text-[10px]">
              <thead className="bg-white/5 text-gray-600 uppercase font-black tracking-[0.2em] border-b border-white/5">
                <tr>
                  <th className="px-8 py-5">Vessel Name</th>
                  <th className="px-8 py-5">Location</th>
                  <th className="px-8 py-5">ETA (UTC)</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vesselData.map((v, i) => (
                  <tr key={i} className="group hover:bg-[#bc66ff]/5 transition-all cursor-pointer">
                    <td className="px-8 py-4 font-black text-[#bc66ff] group-hover:tracking-wider transition-all uppercase">
                      {v.name}
                    </td>
                    <td className="px-8 py-4 font-bold text-gray-400">
                      {v.location}
                    </td>
                    <td className="px-8 py-4 font-bold text-gray-200">
                      {v.eta}
                    </td>
                    <td className="px-8 py-4">
                      <div className={`flex items-center justify-center gap-2 font-black text-[9px] px-3 py-1 rounded-full border border-current/20 bg-current/5 ${v.statusColor}`}>
                        {v.status}
                      </div>
                    </td>
                    <td className="px-8 py-4 font-bold text-gray-600 text-right uppercase">
                      {v.update}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button className="absolute bottom-8 right-8 w-12 h-12 bg-[#bc66ff] rounded-full flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_#bc66ff66] hover:scale-110 transition-transform active:scale-95">
        +
      </button>
    </div>
  );
}