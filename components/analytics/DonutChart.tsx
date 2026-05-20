"use client";

import React from "react";
import { maintenanceData } from "@/app/lib/placeholder-data";

export default function DonutChart() {
  const total = maintenanceData.length;
  
  const activeCount = maintenanceData.filter(d => d.status === "ACTIVE").length;
  const criticalCount = maintenanceData.filter(d => d.status === "CRITICAL").length;
  const plannedCount = total - (activeCount + criticalCount);

  const strokeDasharray = 251.2;
  
  const activePct = (activeCount / total) * 100;
  const criticalPct = (criticalCount / total) * 100;
  const plannedPct = (plannedCount / total) * 100;

  const activeOffset = strokeDasharray - (activePct / 100) * strokeDasharray;
  const criticalOffset = strokeDasharray - ((activePct + criticalPct) / 100) * strokeDasharray;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-8 bg-transparent">
      
      <p className="text-[10px] font-black opacity-40 mb-10 tracking-[0.4em] uppercase text-gray-500">
        Fleet Allocation
      </p>

      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
          <circle 
            cx="50" cy="50" r="40" 
            stroke="currentColor" strokeWidth="12" 
            fill="none" className="text-white/5" 
          />
          
          <circle 
            cx="50" cy="50" r="40" 
            stroke="#818cf8" strokeWidth="12" 
            fill="none" 
            strokeDasharray={strokeDasharray}
            strokeDashoffset={0} 
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          <circle 
            cx="50" cy="50" r="40" 
            stroke="#f43f5e" strokeWidth="12" 
            fill="none" 
            strokeDasharray={strokeDasharray}
            strokeDashoffset={criticalOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
          />

          <circle 
            cx="50" cy="50" r="40" 
            stroke="#bc66ff" strokeWidth="12" 
            fill="none" 
            strokeDasharray={strokeDasharray}
            strokeDashoffset={activeOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(188,102,255,0.5)]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black italic leading-none text-white tracking-tighter">{total}</span>
          <span className="text-[9px] font-black opacity-30 tracking-[0.2em] mt-1 text-gray-400">VESSELS</span>
        </div>
      </div>

      <div className="mt-12 w-full space-y-4 px-2">
        <LegendItem color="bg-[#bc66ff]" label="ACTIVE FLEET" count={activeCount} glow="shadow-[#bc66ff]" />
        <LegendItem color="bg-rose-500" label="CRITICAL STATUS" count={criticalCount} glow="shadow-rose-500" />
        <LegendItem color="bg-indigo-400" label="PLANNED MAINT." count={plannedCount} />
      </div>
    </div>
  );
}

function LegendItem({ color, label, count, glow = "" }: { color: string, label: string, count: number, glow?: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <span className={`w-1.5 h-1.5 ${color} rounded-full ${glow ? `shadow-[0_0_8px_rgba(0,0,0,0)] group-hover:${glow}` : ""} transition-all`}></span>
        <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors tracking-widest uppercase">{label}</span>
      </div>
      <span className="text-[10px] font-black text-white/60 group-hover:text-white transition-colors">{count}</span>
    </div>
  );
}