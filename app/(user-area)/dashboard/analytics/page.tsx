'use client';

import { maintenanceData } from "@/app/lib/placeholder-data"; 
import MetricCard from "@/components/analytics/MetricCard";
import ChartBox from "@/components/analytics/ChartBox";
import DonutChart from "@/components/analytics/DonutChart";
import VesselTable from "@/components/analytics/VesselTable";

export default function Page() {
  const totalVessels = maintenanceData.length;
  const criticalCount = maintenanceData.filter(s => s.status === "CRITICAL").length;
  const avgReady = totalVessels > 0 
    ? Math.round(maintenanceData.reduce((acc, curr) => acc + curr.progress, 0) / totalVessels) 
    : 0;

  return (
    <div className="w-full bg-[#0a0514] min-h-screen">
      <div className="px-10 pt-6">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
            Analytic Dashboard
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-[#bc66ff]/60 uppercase mt-1 font-bold">
            Real-time Fleet Intelligence & Maintenance Status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard title="FLEET READINESS" value={`${avgReady}%`} /> 
          <MetricCard title="MONITORED VESSELS" value={String(totalVessels).padStart(2, '0')} />
          <MetricCard title="FUEL COST INDEX" value="0.94" /> 
          <MetricCard 
            title="SYSTEM ALERTS" 
            value={criticalCount} 
            subtitle={criticalCount > 0 ? "ACTION REQUIRED" : "SYSTEM CLEAR"}
            statusType={criticalCount > 0 ? "warning" : "optimal"} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-[#150e24] rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-xl shadow-2xl min-h-[400px] flex flex-col">
            <ChartBox />
          </div>

          <div className="bg-[#150e24] rounded-[2.5rem] border border-white/5 p-6 flex items-center justify-center shadow-2xl">
            <DonutChart />
          </div>
        </div>

        <div className="mt-8 mb-10">
          <VesselTable />
        </div>
      </div>
    </div>
  );
}