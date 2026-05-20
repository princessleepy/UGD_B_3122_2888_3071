'use client';

import { ExclamationTriangleIcon, CloudIcon, ClockIcon } from '@heroicons/react/24/outline';
import { robotoMono } from '@/app/ui/fonts';

const alerts = [
  {
    type: "CRITICAL",
    title: "Critical Engine Failure",
    time: "04:12 WIB",
    desc: "MV ORION STAR reports pressure drop in Cylinder 4. Emergency maintenance required.",
    color: "rose"
  },
  {
    type: "WARNING",
    title: "Weather Warning",
    time: "02:45 WIB",
    desc: "Cyclone approaching Route A7. Recommend detour +12nm East.",
    color: "purple"
  },
  {
    type: "INFO",
    title: "ETA Delay Prediction",
    time: "01:15 WIB",
    desc: "Port Rotterdam congestion: +4h wait time for all incoming vessels.",
    color: "gray"
  }, 
  {
    type: "CRITICAL",
    title: "Fuel System Failure",
    time: "05:30 WIB",
    desc: "MV PACIFIC DRIFT experiencing abnormal fuel pressure. Immediate inspection required.",
    color: "rose"
  },
  {
    type: "WARNING",
    title: "High Wave Detected",
    time: "03:20 WIB",
    desc: "Sea conditions rising above safe threshold near Tokyo Bay.",
    color: "purple"
  },
  {
    type: "INFO",
    title: "Routine Maintenance Scheduled",
    time: "00:45 WIB",
    desc: "MV SEA VOYAGER scheduled for routine inspection at Los Angeles Terminal.",
    color: "gray"
  },
  {
    type: "WARNING",
    title: "Navigation Signal Weak",
    time: "06:10 WIB",
    desc: "GPS signal instability detected in Hamburg sector. Monitor closely.",
    color: "purple"
  }
];

export default function AlertsPage() {
  return (
    <div className={`min-h-screen bg-[#0d0415] text-white p-6 ${robotoMono.className}`}>

      <h1 className="text-xl font-bold mb-6 tracking-widest uppercase text-[#d095ff]">
        System Alerts
      </h1>

      <div className="space-y-4">
        {alerts.map((a, i) => (
          <div 
            key={i} 
            className={`flex gap-4 p-5 rounded-2xl border border-white/5
              ${a.color === 'rose' && 'bg-rose-500/10 border-l-2 border-rose-500'}
              ${a.color === 'purple' && 'bg-white/5 border-l-2 border-[#d095ff]'}
              ${a.color === 'gray' && 'bg-white/5 border-l-2 border-gray-500'}
            `}
          >
            {a.color === 'rose' && <ExclamationTriangleIcon className="w-5 text-rose-500" />}
            {a.color === 'purple' && <CloudIcon className="w-5 text-[#d095ff]" />}
            {a.color === 'gray' && <ClockIcon className="w-5 text-gray-400" />}

            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <p className={`text-[11px] font-bold uppercase
                  ${a.color === 'rose' && 'text-rose-500'}
                  ${a.color === 'purple' && 'text-[#d095ff]'}
                  ${a.color === 'gray' && 'text-gray-400'}
                `}>
                  {a.title}
                </p>
                <p className="text-[9px] text-gray-500">{a.time}</p>
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