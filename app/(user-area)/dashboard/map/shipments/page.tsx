'use client';
import React, { useState } from 'react';
import { shipmentData } from "@/app/lib/placeholder-data";

export default function ActiveShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = shipmentData.filter(s => 
    s.vessel.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white/90">Active Shipments</h1>
          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1">REAL-TIME GLOBAL LOGISTICS MONITORING V4.0</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right bg-[#150e24] p-3 px-6 rounded-2xl border border-white/5 shadow-xl">
            <p className="text-[8px] text-gray-500 font-bold uppercase">Total Units</p>
            <p className="text-xl font-black">{shipmentData.length}</p>
          </div>
          <div className="text-right bg-[#150e24] p-3 px-6 rounded-2xl border border-white/5 shadow-xl">
            <p className="text-[8px] text-rose-500 font-bold uppercase">Alert Zone</p>
            <p className="text-xl font-black text-rose-500">2 ACTIVE</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#150e24] border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 hover:border-[#bc66ff]/20 transition-all">
          <div className="text-3xl p-3 bg-white/5 rounded-2xl">💨</div>
          <div>
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Avg. Conditions</p>
            <p className="text-sm font-black uppercase">Moderate Winds</p>
          </div>
        </div>
        <div className="bg-[#150e24] border border-white/5 p-6 rounded-[2rem] flex items-center gap-4 hover:border-cyan-500/20 transition-all">
          <div className="text-3xl p-3 bg-white/5 rounded-2xl">🌊</div>
          <div>
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Sea State</p>
            <p className="text-sm font-black uppercase text-cyan-400">Calm Seas</p>
          </div>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-[2rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-rose-500 flex items-center justify-center text-rose-500 font-black animate-pulse">!</div>
            <div>
              <p className="text-[8px] text-rose-500 font-black uppercase">Weather Alerts</p>
              <p className="text-[10px] font-bold uppercase">Cyclone 'ZEPHYR' - Sector 7G</p>
            </div>
          </div>
          <button className="text-[8px] font-black uppercase bg-rose-500/20 px-4 py-2 rounded-full hover:bg-rose-500/40 transition-all">View Alerts</button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input 
                type="text" 
                placeholder="SEARCH SHIPMENT ID. . ."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="bg-[#150e24] border border-white/10 rounded-full py-2.5 px-10 text-[9px] font-bold w-72 focus:border-[#bc66ff] transition-all outline-none"
              />
              <span className="absolute left-4 top-3 text-gray-600">🔍</span>
            </div>
            <button className="text-[9px] font-bold uppercase flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
              <span className="text-lg">≡</span> Filter
            </button>
          </div>
          <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">Displaying {filteredData.length} entries</span>
        </div>

        <div className="bg-[#150e24]/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="text-gray-600 uppercase font-black tracking-widest border-b border-white/5 bg-white/[0.02]">
                <tr>
                  <th className="px-8 py-6">Shipment ID</th>
                  <th className="px-8 py-6">Vessel Name</th>
                  <th className="px-8 py-6">Cargo Type</th>
                  <th className="px-8 py-6">Destination</th>
                  <th className="px-8 py-6">Weather</th>
                  <th className="px-8 py-6 text-right">Quantity</th>
                  <th className="px-8 py-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((s, i) => (
                  <tr key={i} className={`group hover:bg-[#bc66ff]/5 transition-all ${s.alert ? 'bg-rose-500/[0.03]' : ''}`}>
                    <td className="px-8 py-5 font-bold text-gray-500 group-hover:text-[#bc66ff] transition-colors">{s.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">🚢</span>
                        <span className="font-black uppercase tracking-tight">{s.vessel}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded border text-[8px] font-black tracking-tighter uppercase
                        ${s.type === 'ELECTRONICS' ? 'border-cyan-500/30 text-cyan-400' : 
                          s.type === 'MEDICAL' ? 'border-purple-500/30 text-purple-400' : 
                          'border-emerald-500/30 text-emerald-400'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-400 font-bold italic uppercase">{s.destination}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2 font-bold">
                          <span>{s.weatherIcon}</span> {s.weather}
                        </div>
                        {s.alert && <span className="text-[7px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">SEVERE ALERT</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-right">{s.quantity}</td>
                    <td className="px-8 py-5">
                      <div className={`px-4 py-1.5 rounded-full text-center block font-black tracking-tighter shadow-sm border border-current/20 bg-current/5 ${s.statusColor}`}>
                        {s.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button className="bg-white/5 border border-white/10 hover:bg-[#bc66ff] hover:text-black px-12 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg">
            Load More Logistics Data
          </button>
        </div>
      </div>
    </div>
  );
}