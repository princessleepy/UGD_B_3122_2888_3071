'use client';

import React from 'react';
import { 
  ExclamationTriangleIcon, 
  CloudIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { robotoMono } from '@/app/ui/fonts';

import { alerts } from "@/app/lib/placeholder-data"; 

export default function AlertsPage() {
  return (
    <div className={`min-h-screen bg-[#0d0415] text-white p-10 ${robotoMono.className}`}>
      
      <h1 className="text-xl font-black mb-8 tracking-[0.3em] uppercase text-[#bc66ff]">
        System Alerts
      </h1>

      <div className="max-w-3xl space-y-4">
        {alerts.map((a, i) => (
          <div 
            key={i} 
            className={`flex gap-5 p-6 rounded-2xl border transition-all hover:bg-white/[0.02]
              ${a.color === 'rose' ? 'bg-rose-500/10 border-rose-500/20 border-l-4 border-l-rose-500' : 
                a.color === 'purple' ? 'bg-[#bc66ff]/5 border-[#bc66ff]/20 border-l-4 border-l-[#bc66ff]' : 
                'bg-white/5 border-white/10 border-l-4 border-l-gray-500'}
            `}
          >
            <div className="shrink-0 pt-1">
              {a.color === 'rose' && <ExclamationTriangleIcon className="w-6 h-6 text-rose-500" />}
              {a.color === 'purple' && <CloudIcon className="w-6 h-6 text-[#bc66ff]" />}
              {a.color === 'gray' && <ClockIcon className="w-6 h-6 text-gray-500" />}
            </div>

            <div className="w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-[12px] font-black uppercase tracking-tight
                  ${a.color === 'rose' ? 'text-rose-500' : a.color === 'purple' ? 'text-[#bc66ff]' : 'text-gray-400'}
                `}>
                  {a.title}
                </h3>
                <span className="text-[10px] font-bold text-gray-600 tracking-tighter">{a.time}</span>
              </div>
              
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {a.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}