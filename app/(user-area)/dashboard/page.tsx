'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CloudIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  dashboardStats, 
  mapVesselData, 
  alerts 
} from "@/app/lib/placeholder-data";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d0415] text-white p-6 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="bg-[#1a0b2e] p-5 rounded-[20px] border border-white/5 shadow-lg">
            <p className="text-[9px] tracking-[0.2em] text-gray-500 mb-2 uppercase font-bold">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${i === 0 ? 'text-[#bc66ff]' : 'text-white'}`}>
                {stat.value}
              </span>
              <span className={`text-[9px] font-bold tracking-tighter ${stat.subColor}`}>
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-[13px] font-extrabold tracking-[0.25em] mb-4 text-white uppercase italic">Global Map Feed</h2>
          <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 relative h-[450px] overflow-hidden group shadow-2xl">
            
            <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#bc66ff] animate-pulse" />
              <span className="text-[9px] tracking-widest font-bold text-white uppercase">Live Telemetry // Signal Active</span>
            </div>

            <div className="w-full h-full opacity-30 grayscale invert contrast-125 brightness-50 relative">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=-6.1214,106.8744&t=k&z=4&ie=UTF8&iwloc=&output=embed" 
                className="pointer-events-none" 
              ></iframe>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            </div>

            <div className="absolute bottom-8 right-8 z-20 text-right bg-black/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
              <p className="text-[7px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Target Signal</p>
              <p className="text-sm font-black text-[#bc66ff] tracking-tight uppercase">MV NEON HORIZON</p>
              <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">Pos: 5.95°S / 106.12°E</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[13px] font-extrabold tracking-[0.25em] text-white uppercase italic">System Alerts</h2>
            <span className="bg-rose-600 text-white text-[8px] px-2 py-0.5 rounded-sm font-black tracking-widest uppercase">
              {alerts.length} Active
            </span>
          </div>
          <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 p-6 flex-grow shadow-lg overflow-y-auto max-h-[450px]">
            <div className="space-y-4">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`flex gap-4 p-4 border-l-2 rounded-r-2xl ${
                  alert.color === 'rose' ? 'bg-rose-500/5 border-rose-500' : 'bg-[#bc66ff]/5 border-[#bc66ff]'
                }`}>
                  {alert.color === 'rose' ? (
                    <ExclamationTriangleIcon className="w-5 h-5 text-rose-500 shrink-0" />
                  ) : (
                    <CloudIcon className="w-5 h-5 text-[#bc66ff] shrink-0" />
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-[9px] font-black uppercase tracking-tighter ${
                        alert.color === 'rose' ? 'text-rose-500' : 'text-[#bc66ff]'
                      }`}>{alert.title}</p>
                      <p className="text-[8px] text-gray-600 font-bold">{alert.time}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed uppercase">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 flex justify-between items-center">
            <h2 className="text-[13px] font-extrabold tracking-[0.25em] text-white uppercase italic">Fleet Registry</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" 
                placeholder="SCAN_SIGNALS..." 
                className="bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-[10px] w-64 outline-none focus:border-[#bc66ff]/50 font-bold tracking-widest transition-all"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="text-[9px] text-gray-500 uppercase tracking-[0.2em] bg-white/5">
              <tr>
                <th className="px-8 py-4 font-black">Vessel ID</th>
                <th className="px-8 py-4 font-black">Status</th>
                <th className="px-8 py-4 font-black">Velocity</th>
                <th className="px-8 py-4 font-black">Heading</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mapVesselData.map((v) => (
                <tr key={v.id} className="hover:bg-[#bc66ff]/5 transition-all group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="font-black text-[11px] group-hover:text-[#bc66ff] transition-colors">{v.name}</div>
                    <div className="text-[9px] text-gray-600 font-bold tracking-tighter mt-0.5 uppercase">ID: {v.id}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-current ${v.statusColor.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
                      <span className={`text-[9px] font-black uppercase tracking-tight ${v.statusColor}`}>
                        {v.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[10px] font-black text-white">{v.speed}</td>
                  <td className="px-8 py-5 text-[10px] text-gray-500 font-bold uppercase truncate max-w-[180px]">{v.destination}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[13px] font-extrabold tracking-[0.25em] text-white uppercase italic">Fleet Performance</h2>
          <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 p-8 flex-grow shadow-lg">
            <div className="flex items-end justify-between h-40 gap-2 mb-8 px-2 border-b border-white/5 pb-2">
              {[45, 65, 50, 95, 70, 55, 85].map((h, i) => (
                <div 
                  key={i} 
                  className={`w-full rounded-t-lg transition-all duration-500 hover:brightness-125 ${i === 3 ? 'bg-[#bc66ff] shadow-[0_0_20px_#bc66ff]' : 'bg-white/10'}`} 
                  style={{ height: `${h}%` }} 
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <p className="text-[8px] text-gray-600 uppercase font-black mb-1 tracking-widest">Efficiency Rate</p>
                <p className="text-xl font-black text-[#bc66ff]">94.2%</p>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <p className="text-[8px] text-gray-600 uppercase font-black mb-1 tracking-widest">Fleet Idle Time</p>
                <p className="text-xl font-black text-white uppercase tracking-tighter">Nominal</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}