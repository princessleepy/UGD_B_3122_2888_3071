'use client';
import React from 'react';
import { maintenanceData as rawData } from "@/app/lib/placeholder-data"; 

interface MaintenanceItem {
  name: string;
  progress: number;
  eta: string;
  status: string;
  engineEff?: string;
  nextService?: string;
  failure?: string;
  temp?: string;
  location?: string;
  hullInspect?: string;
  refitProg?: string;
  dockId?: string;
}

export default function MaintenancePage() {
  const maintenanceData = rawData as MaintenanceItem[];
  const criticalCount = maintenanceData.filter(m => m.status === 'CRITICAL').length;
  const activeCount = maintenanceData.filter(m => m.status === 'ACTIVE' || m.status === 'DRY DOCK').length;
  const avgProgress = maintenanceData.length > 0 
    ? Math.round(maintenanceData.reduce((acc, curr) => acc + curr.progress, 0) / maintenanceData.length) 
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Maintenance Hub</h1>
          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1">AQUALYNX SYSTEMS - ENGINEERING DIV.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#150e24] px-5 py-2.5 rounded-full border border-white/5 shadow-2xl">
           <span className={`w-2 h-2 rounded-full ${criticalCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             System: {criticalCount > 0 ? 'Action Required' : 'Optimal'}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#150e24] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-colors">
          <p className="text-[8px] text-gray-500 font-bold uppercase mb-4">Active Service</p>
          <p className="text-4xl font-black">{String(activeCount).padStart(2, '0')}</p>
        </div>
        <div className="bg-[#150e24] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-colors">
          <p className="text-[8px] text-gray-500 font-bold uppercase mb-4">Total Fleet</p>
          <p className="text-4xl font-black text-[#bc66ff]">{String(maintenanceData.length).padStart(2, '0')}</p>
        </div>
        <div className="bg-[#150e24] border border-white/5 p-6 rounded-3xl">
          <p className="text-[8px] text-gray-500 font-bold uppercase mb-4">Fleet Health Score</p>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black">{avgProgress}%</p>
            <div className="w-full h-1 bg-white/5 rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-[#bc66ff] transition-all duration-1000 shadow-[0_0_10px_#bc66ff]" style={{width: `${avgProgress}%`}}></div>
            </div>
          </div>
        </div>
        <div className={`border p-6 rounded-3xl transition-all duration-500 ${criticalCount > 0 ? 'bg-rose-500/10 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.1)]' : 'bg-[#150e24] border-white/5'}`}>
          <p className={`text-[8px] font-bold uppercase mb-4 ${criticalCount > 0 ? 'text-rose-500' : 'text-gray-500'}`}>Critical Alerts</p>
          <p className={`text-4xl font-black ${criticalCount > 0 ? 'text-rose-500 underline decoration-double' : 'text-white'}`}>
            {String(criticalCount).padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-[#150e24] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Live Maintenance Progress</h2>
          <div className="space-y-8">
            {maintenanceData.map((m, i) => (
              <div key={i} className="space-y-2 group">
                <div className="flex justify-between items-end">
                  <p className="text-[11px] font-black tracking-widest group-hover:text-[#bc66ff] transition-colors">{m.name}</p>
                  <p className="text-[9px] font-bold text-gray-600">{m.progress}%</p>
                </div>
                <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${m.status === 'CRITICAL' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-[#bc66ff] shadow-[0_0_10px_#bc66ff]'}`} 
                    style={{width: `${m.progress}%`}}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[8px] text-gray-700 font-black uppercase">
                  <p>Est: {m.eta}</p>
                  <p className={m.status === 'CRITICAL' ? 'text-rose-500' : ''}>{m.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#150e24] border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-2xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Critical Inventory</h2>
          <div className="space-y-6 mt-8 flex-grow">
            {[
              { label: "Propulsion Units", qty: "04", val: 40 },
              { label: "Coolant Level", qty: "1,240 L", val: 65 },
              { label: "Emergency Kits", qty: "02 (LOW)", val: 15, crit: true },
              { label: "Hull Plating", qty: "12 units", val: 80 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-[8px] font-black uppercase text-gray-500">{item.label}</span>
                  <span className={`text-[8px] font-black ${item.crit ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{item.qty}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className={`h-full ${item.crit ? 'bg-rose-500' : 'bg-[#bc66ff]/40'}`} style={{width: `${item.val}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 bg-[#bc66ff] text-black hover:bg-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
            Restock Inventory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {maintenanceData.map((m, i) => (
          <div key={i} className={`p-6 rounded-[2.5rem] border transition-all hover:scale-[1.02] duration-300 ${m.status === 'CRITICAL' ? 'bg-rose-500/5 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.05)]' : 'bg-[#150e24] border-white/5 shadow-xl'}`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-tighter w-2/3 leading-tight group-hover:text-[#bc66ff]">{m.name}</h3>
              <span className={`text-[7px] px-2 py-1 rounded font-black border uppercase ${m.status === 'CRITICAL' ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                {m.status}
              </span>
            </div>

            <div className="space-y-3 min-h-[50px]">
              {m.status === 'ACTIVE' && (
                <>
                  <div className="flex justify-between text-[9px] font-bold uppercase"><span className="text-gray-600">Engine:</span> <span className="text-[#bc66ff]">{m.engineEff}</span></div>
                  <div className="flex justify-between text-[9px] font-bold uppercase"><span className="text-gray-600">Next:</span> <span>{m.nextService}</span></div>
                </>
              )}
              {m.status === 'CRITICAL' && (
                <>
                  <div className="flex justify-between text-[9px] font-black uppercase text-rose-500"><span>Issue:</span> <span className="truncate ml-2">{m.failure}</span></div>
                  <div className="flex justify-between text-[9px] font-black uppercase text-rose-500"><span>Temp:</span> <span>{m.temp}</span></div>
                </>
              )}
              {(m.status === 'PLANNED' || m.status === 'IN PORT') && (
                <>
                  <div className="flex justify-between text-[9px] font-bold uppercase text-gray-500"><span>Inspect:</span> <span className="text-white">PENDING</span></div>
                  <div className="flex justify-between text-[9px] font-bold uppercase text-gray-500"><span>Loc:</span> <span className="text-white truncate ml-2">{m.location}</span></div>
                </>
              )}
              {m.status === 'DRY DOCK' && (
                <>
                  <div className="flex justify-between text-[9px] font-bold uppercase text-gray-500"><span>Refit:</span> <span className="text-white">{m.refitProg}</span></div>
                  <div className="flex justify-between text-[9px] font-bold uppercase text-gray-500"><span>Dock:</span> <span className="text-white">{m.dockId}</span></div>
                </>
              )}
            </div>

            <button className={`w-full mt-6 py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest transition-all ${m.status === 'CRITICAL' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'border border-white/10 hover:bg-white/5 text-gray-500 hover:text-white'}`}>
              {m.status === 'CRITICAL' ? 'Emergency Service' : 'View Parameters'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}