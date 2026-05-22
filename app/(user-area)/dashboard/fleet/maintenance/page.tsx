'use client';

import React, {
  useEffect,
  useState,
  Suspense,
} from 'react';

import { maintenanceData as rawData } from '@/app/lib/placeholder-data';
import { UserDashboardSkeleton } from '@/app/ui/skeletons';

interface MaintenanceItem {
  name: string;
  progress: number;
  status: string;
  eta: string;
}

function MaintenanceContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const maintenanceData = rawData as MaintenanceItem[];

  const itemsPerPage = 5;

  const totalPages = Math.ceil(
    maintenanceData.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedMaintenanceData = maintenanceData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const criticalCount = maintenanceData.filter(
    (m) => m.status === 'CRITICAL'
  ).length;

  const activeCount = maintenanceData.filter(
    (m) => m.status !== 'IDLE'
  ).length;

  const avgProgress =
    maintenanceData.length > 0
      ? Math.round(
          maintenanceData.reduce((a, b) => a + b.progress, 0) /
            maintenanceData.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Maintenance Hub
          </h1>

          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1">
            AQUALYNX SYSTEMS - ENGINEERING DIV.
          </p>
        </div>

        <div className="px-5 py-2.5 rounded-full border border-white/5 bg-[#150e24]">
          <span className="text-[10px] uppercase font-bold">
            System Status:{' '}
            {criticalCount > 0 ? 'Action Required' : 'Optimal'}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#150e24] p-6 rounded-3xl border border-white/5">
          <p className="text-[8px] text-gray-500 uppercase">
            Active Service
          </p>

          <p className="text-4xl font-black">{activeCount}</p>
        </div>

        <div className="bg-[#150e24] p-6 rounded-3xl border border-white/5">
          <p className="text-[8px] text-gray-500 uppercase">
            Total Fleet
          </p>

          <p className="text-4xl font-black text-[#bc66ff]">
            {maintenanceData.length}
          </p>
        </div>

        <div className="bg-[#150e24] p-6 rounded-3xl border border-white/5">
          <p className="text-[8px] text-gray-500 uppercase">
            Fleet Health
          </p>

          <p className="text-4xl font-black">{avgProgress}%</p>
        </div>

        <div className="bg-[#150e24] p-6 rounded-3xl border border-white/5">
          <p className="text-[8px] text-gray-500 uppercase">
            Critical
          </p>

          <p className="text-4xl font-black text-rose-500">
            {criticalCount}
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 bg-[#150e24] rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] uppercase text-gray-500">
              Live Maintenance Progress
            </h2>

            <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">
              Page {currentPage} / {totalPages}
            </span>
          </div>

          <div className="space-y-6">
            {paginatedMaintenanceData.map((m, i) => (
              <div key={`${m.name}-${i}`} className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-[11px] font-black uppercase">
                    {m.name}
                  </p>

                  <p className="text-[9px] text-gray-500">
                    {m.progress}%
                  </p>
                </div>

                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      m.status === 'CRITICAL'
                        ? 'bg-rose-500'
                        : 'bg-[#bc66ff]'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-[8px] text-gray-600 uppercase">
                  <span>{m.eta}</span>
                  <span>{m.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-8 border-t border-white/5 mt-8">
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

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-4 bg-[#150e24] rounded-[2.5rem] p-8 border border-white/5">
          <h2 className="text-[10px] uppercase text-gray-500">
            Inventory
          </h2>

          <button className="mt-8 w-full bg-[#bc66ff] text-black py-4 rounded-2xl font-black text-[9px] uppercase">
            Restock Inventory
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<UserDashboardSkeleton />}>
      {loading ? <UserDashboardSkeleton /> : <MaintenanceContent />}
    </Suspense>
  );
}