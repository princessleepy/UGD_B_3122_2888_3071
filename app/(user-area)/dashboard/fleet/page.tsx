'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { dashboardStats, vesselData } from "@/app/lib/placeholder-data";
import { UserDashboardSkeleton } from '@/app/ui/skeletons';

function FleetContent() {
  return (
    <div className="min-h-screen bg-[#0d0415] text-white p-6 font-mono">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="bg-[#1a0b2e] p-5 rounded-[20px] border border-white/5">
            <p className="text-[9px] text-gray-500 mb-2 uppercase font-bold tracking-[0.2em]">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">{stat.value}</span>
              <span className={`text-[9px] font-bold ${stat.subColor}`}>
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-white/5 text-[9px] text-gray-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-4">Vessel</th>
              <th className="px-8 py-4">Location</th>
              <th className="px-8 py-4">ETA</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4 text-right">Update</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {vesselData.map((v, i) => (
              <tr key={i}>
                <td className="px-8 py-5 text-[#bc66ff] font-black uppercase">
                  {v.name}
                </td>
                <td className="px-8 py-5 text-gray-400">
                  {v.location}
                </td>
                <td className="px-8 py-5">
                  {v.eta}
                </td>
                <td className="px-8 py-5 text-center">
                  {v.status}
                </td>
                <td className="px-8 py-5 text-right text-gray-500 uppercase">
                  {v.update}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default function FleetPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<UserDashboardSkeleton />}>
      {loading ? <UserDashboardSkeleton /> : <FleetContent />}
    </Suspense>
  );
}