'use client';

import React, {
  useEffect,
  useState,
  Suspense,
} from 'react';

import {
  maintenanceData,
  vesselData,
  mapVesselData,
} from '@/app/lib/placeholder-data';

import { PerformanceAnalyticsSkeleton } from '@/app/ui/skeletons';

import MaintenanceMetricCard from '@/components/analytics/MetricCard';

function PerformanceContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const vesselBreakdown = vesselData.map((v) => {
    const mData = maintenanceData.find((m) => m.name === v.name);

    const mapData = mapVesselData.find(
      (mapV) => mapV.name === v.name
    );

    return {
      name: v.name,
      id:
        mapData?.id ||
        v.name.substring(0, 3).toUpperCase() + '-01',
      score: mData ? mData.progress : 80,
      trips: mData ? Math.floor(mData.progress * 1.5) : 50,
      speed: mapData?.speed || '14.0 KN',
      status:
        v.status === 'MAINTENANCE' || mData?.status === 'CRITICAL'
          ? 'MAINTENANCE'
          : 'OPTIMAL',
    };
  });

  const totalPages = Math.ceil(
    vesselBreakdown.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedVessels = vesselBreakdown.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const performanceScores = [...vesselBreakdown]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((v) => ({
      name: v.name,
      score: (v.score / 10).toFixed(2),
      percentage: v.score,
    }));

  const avgEfficiency =
    maintenanceData.length > 0
      ? Math.round(
          maintenanceData.reduce(
            (acc, curr) => acc + curr.progress,
            0
          ) / maintenanceData.length
        )
      : 0;

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
            value={`${avgEfficiency}%`}
            status="SCORE"
            progress={avgEfficiency}
          />

          <MaintenanceMetricCard
            title="Monitored Vessels"
            value={vesselData.length.toString()}
            status="UNITS"
            progress={100}
          />

          <MaintenanceMetricCard
            title="System Alerts"
            value={maintenanceData
              .filter((m) => m.status === 'CRITICAL')
              .length.toString()}
            status="ISSUES"
            statusType={
              maintenanceData.some((m) => m.status === 'CRITICAL')
                ? 'warning'
                : 'optimal'
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a0b2e]/50 rounded-[20px] border border-white/5 p-8 backdrop-blur-sm flex flex-col h-[400px]">
            <h3 className="text-[11px] font-extrabold tracking-[0.2em] text-white uppercase mb-10">
              Quarterly Performance Trend
            </h3>

            <div className="flex-grow relative">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 160 L 100 120 L 200 180 L 300 140 L 400 190 L 500 130 L 600 150"
                  fill="none"
                  stroke="#d095ff"
                  strokeWidth="2"
                />
              </svg>
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
                <tr
                  key={v.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-10 py-6">
                    <div className="text-[10px] font-black text-white">
                      {v.name}
                    </div>

                    <div className="text-[8px] text-white/30 font-mono">
                      ID: {v.id}
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-white/40">
                        {v.score}%
                      </span>

                      <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#d095ff]"
                          style={{ width: `${v.score}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-center text-[10px] text-white/60 font-mono">
                    {v.speed}
                  </td>

                  <td className="px-10 py-6 text-right">
                    <span
                      className={`text-[8px] font-black px-3 py-1 rounded-full border ${
                        v.status === 'OPTIMAL'
                          ? 'text-emerald-400 border-emerald-400/20'
                          : 'text-rose-500 border-rose-500/20'
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
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#d095ff] hover:text-[#d095ff] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-all"
            >
              Prev
            </button>

            <div className="px-5 py-2 rounded-full bg-black/30 border border-white/10 text-[10px] uppercase tracking-widest text-white/60 font-black">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#d095ff] hover:text-[#d095ff] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<PerformanceAnalyticsSkeleton />}>
      {loading ? (
        <PerformanceAnalyticsSkeleton />
      ) : (
        <PerformanceContent />
      )}
    </Suspense>
  );
}