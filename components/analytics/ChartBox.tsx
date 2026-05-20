'use client';
import React from 'react';
import { chartData, chartLabels } from "@/app/lib/placeholder-data"; 

export default function ChartBox() {
  return (
    <div className="w-full h-full flex flex-col p-10 pt-20 bg-transparent">
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500">
            FLEET EFFICIENCY
          </p>
          <p className="text-[10px] text-[#bc66ff] font-bold tracking-widest mt-1 uppercase opacity-80">
            Current Load Distribution
          </p>
        </div>

        <div className="flex items-center gap-6 text-[10px] tracking-[0.25em] uppercase font-black">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#bc66ff] shadow-[0_0_10px_#bc66ff]"></span>
            <span className="text-gray-400">Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]"></span>
            <span className="text-gray-400">Low</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-end gap-5 h-[150px] w-full px-2">
          {chartData.slice(0, chartLabels.length).map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
              
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-12 bg-[#bc66ff] text-black text-[10px] px-3 py-1 rounded-md font-black whitespace-nowrap shadow-[0_0_20px_rgba(188,102,255,0.4)] z-10">
                {value}% LOAD
              </div>
              
              <div
                className={`w-full rounded-t-3xl transition-all duration-1000 hover:brightness-125 ${
                  value < 40 
                    ? 'bg-gradient-to-t from-rose-600/40 to-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]' 
                    : 'bg-gradient-to-t from-[#bc66ff]/20 to-[#bc66ff] shadow-[0_0_30px_rgba(188,102,255,0.1)]'
                }`}
                style={{ height: `${(value / 100) * 150}px` }} 
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8 border-t border-white/5 pt-6">
          {chartLabels.map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[10px] text-gray-600 font-black tracking-[0.2em] uppercase block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}