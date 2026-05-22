'use client';

import React, {
  useState,
  useEffect,
  Suspense,
} from 'react';

import {
  maintenanceData,
  fuelAnalyticsData,
} from '@/app/lib/placeholder-data';

import { AnalyticsDashboardSkeleton } from '@/app/ui/skeletons';

import MetricCard from '@/components/analytics/MetricCard';
import ChartBox from '@/components/analytics/ChartBox';
import DonutChart from '@/components/analytics/DonutChart';

function AnalyticsDashboardContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const totalVessels = maintenanceData.length;

  const criticalCount = maintenanceData.filter(
    (s) => s.status === 'CRITICAL'
  ).length;

  const avgReady =
    totalVessels > 0
      ? Math.round(
          maintenanceData.reduce(
            (acc, curr) => acc + curr.progress,
            0
          ) / totalVessels
        )
      : 0;

  const totalPages = Math.ceil(
    fuelAnalyticsData.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedAuditData = fuelAnalyticsData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
          <MetricCard
            title="FLEET READINESS"
            value={`${avgReady}%`}
          />

          <MetricCard
            title="MONITORED VESSELS"
            value={String(totalVessels).padStart(2, '0')}
          />

          <MetricCard
            title="FUEL COST INDEX"
            value="0.94"
          />

          <MetricCard
            title="SYSTEM ALERTS"
            value={criticalCount}
            subtitle={
              criticalCount > 0
                ? 'ACTION REQUIRED'
                : 'SYSTEM CLEAR'
            }
            statusType={
              criticalCount > 0
                ? 'warning'
                : 'optimal'
            }
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

        <div className="mt-8 mb-10 bg-[#150e24] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
              Vessel Audit
            </h3>

            <input
              type="text"
              placeholder="FILTER VESSELS..."
              className="bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-[9px] text-white font-bold tracking-widest outline-none placeholder:text-white/40"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] text-white/30 uppercase tracking-[0.25em] border-b border-white/5">
                  <th className="px-8 py-6 font-black">
                    Vessel Identifier
                  </th>
                  <th className="px-8 py-6 font-black">
                    Fuel Status
                  </th>
                  <th className="px-8 py-6 font-black">
                    Cons. Rate
                  </th>
                  <th className="px-8 py-6 font-black">
                    Voyage Dist.
                  </th>
                  <th className="px-8 py-6 font-black text-right">
                    Efficiency Score
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {paginatedAuditData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-white/10" />

                        <div>
                          <p className="text-[12px] text-white font-black tracking-widest uppercase">
                            MV {item.name}
                          </p>

                          <p className="text-[9px] text-white/30 font-bold uppercase">
                            {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color}`}
                          style={{ width: `${item.fuel}%` }}
                        />
                      </div>

                      <p className="text-[8px] text-white/40 font-black uppercase mt-2">
                        {item.fuel}% {item.fuelText}
                      </p>
                    </td>

                    <td className="px-8 py-6 text-[11px] text-white font-black">
                      {item.rate}
                    </td>

                    <td className="px-8 py-6 text-[11px] text-white font-black">
                      {item.dist}
                    </td>

                    <td className="px-8 py-6 text-right">
                      <span
                        className={`inline-flex rounded-lg border px-4 py-2 text-[9px] font-black uppercase ${
                          item.score.includes('LOW')
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                            : 'border-[#bc66ff]/30 bg-[#bc66ff]/10 text-white'
                        }`}
                      >
                        {item.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-3 px-8 py-6 border-t border-white/5">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-all"
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
              className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase font-black text-white/60 hover:border-[#bc66ff] hover:text-[#bc66ff] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<AnalyticsDashboardSkeleton />}>
      {loading ? (
        <AnalyticsDashboardSkeleton />
      ) : (
        <AnalyticsDashboardContent />
      )}
    </Suspense>
  );
}