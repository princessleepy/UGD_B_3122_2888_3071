'use client';

import React, { useState } from 'react';
import { PerformanceVessel, VehicleStats } from '@/app/lib/definitions';
import MaintenanceMetricCard from '@/components/analytics/MetricCard';

const MONTH_LABELS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export default function PerformanceClient({
  stats,
  allVessels,
  topScores,
  trendData,
}: {
  stats: VehicleStats;
  allVessels: PerformanceVessel[];
  topScores: { vehicle_name: string; efficiency_score: number }[];
  trendData: number[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allVessels.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVessels = allVessels.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const performanceScores = topScores.map((v) => ({
    name: v.vehicle_name,
    score: (v.efficiency_score / 10).toFixed(2),
    percentage: Math.round(v.efficiency_score),
  }));

  const pathPoints = trendData
    .map((value, i) => {
      const x = (i / (trendData.length - 1)) * 600;
      const y = 200 - (value / 100) * 160;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="w-full">
      <div className="px-10 pt-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide text-white uppercase">
              Performance Analytics
            </h1>
            <p className="text-[10px] tracking-widest opacity-60 text-[#bc66ff] uppercase mt-1 font-bold">
              Real-time Fleet Efficiency & Operational Metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MaintenanceMetricCard
            title="Fleet Efficiency"
            value={`${stats.readiness}%`}
            status="SCORE"
            progress={Number(stats.readiness)}
          />
          <MaintenanceMetricCard
            title="Monitored Vessels"
            value={String(stats.total)}
            status="UNITS"
            progress={100}
          />
          <MaintenanceMetricCard
            title="System Alerts"
            value={String(stats.maintenance)}
            status="ISSUES"
            statusType={stats.maintenance > 0 ? 'warning' : 'optimal'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a0b2e]/50 rounded-[20px] border border-white/5 p-8 backdrop-blur-sm flex flex-col h-[400px]">
            <h3 className="text-[11px] font-extrabold tracking-[0.2em] text-white uppercase mb-4">
              Quarterly Performance Trend
            </h3>
            <p className="text-[8px] text-white/30 uppercase tracking-widest mb-4">
              Y-Axis: Efficiency Score (%)
            </p>
            <div className="flex-grow relative">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="none"
              >
                <path d={pathPoints} fill="none" stroke="#d095ff" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex justify-between mt-4 border-t border-white/5 pt-4">
              {MONTH_LABELS.map((label) => (
                <span
                  key={label}
                  className="text-[8px] text-white/30 font-black tracking-widest"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#1a0b2e]/50 rounded-[20px] border border-white/5 p-8 backdrop-blur-sm flex flex-col">
            <h3 className="text-[11px] font-extrabold tracking-[0.2em] text-white uppercase mb-10">
              Top Vessel Scores
            </h3>
            <div className="space-y-8 flex-grow">
              {performanceScores.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-3">
                    <span className="text-[9px] text-[#d095ff] font-black tracking-widest">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-white font-black">
                      {item.score}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d095ff]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1a0b2e]/50 rounded-[20px] border border-white/5 overflow-hidden mb-10">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold tracking-[0.2em] text-white uppercase">
              Vessel Breakdown
            </h3>
            <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">
              Page {currentPage} / {totalPages}
            </span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[8px] text-white/20 uppercase font-black border-b border-white/5">
                <th className="px-10 py-5">Vessel Name / ID</th>
                <th className="px-8 py-5">Performance</th>
                <th className="px-8 py-5 text-center">Avg Speed</th>
                <th className="px-10 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedVessels.map((v) => (
                <tr key={v.vehicle_code} className="hover:bg-white/5 transition-colors">
                  <td className="px-10 py-6">
                    <div className="text-[10px] font-black text-white">{v.vehicle_name}</div>
                    <div className="text-[8px] text-white/30 font-mono">
                      ID: {v.vehicle_code}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-white/40">
                        {Math.round(Number(v.performance))}%
                      </span>
                      <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#d095ff]"
                          style={{ width: `${Number(v.performance)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center text-[10px] text-white/60 font-mono">
                    {Number(v.avg_speed).toFixed(1)} KN
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span
                      className={`text-[8px] font-black px-3 py-1 rounded-full border ${
                        v.status === 'OPTIMAL'
                          ? 'text-emerald-400 border-emerald-400/20'
                          : v.status === 'LOW'
                            ? 'text-rose-500 border-rose-500/20'
                            : 'text-indigo-400 border-indigo-400/20'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center gap-3 px-8 py-6 border-t border-white/5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#d095ff] hover:text-[#d095ff] disabled:opacity-30 transition-all"
            >
              Prev
            </button>
            <div className="px-5 py-2 rounded-full bg-black/30 border border-white/10 text-[10px] uppercase tracking-widest text-white/60 font-black">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#d095ff] hover:text-[#d095ff] disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
