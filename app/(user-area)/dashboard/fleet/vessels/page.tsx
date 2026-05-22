'use client';
import React, {
  useState,
  useEffect,
  Suspense,
} from 'react';

import { mapVesselData as vesselsList } from '@/app/lib/placeholder-data';
import { VesselSkeleton } from '@/app/ui/skeletons';

function VesselGrid({
  paginatedVessels,
}: {
  paginatedVessels: any[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {paginatedVessels.map((v) => (

        <div
          key={v.id}
          className="bg-[#150e24] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-[#bc66ff]/30 transition-all duration-500 shadow-2xl"
        >

          <div className="h-48 bg-gradient-to-b from-gray-800 to-[#150e24] relative flex items-center justify-center overflow-hidden">

            <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-700">
              🚢
            </div>

            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[7px] font-black tracking-widest bg-current/10 ${v.statusColor}`}
            >
              {v.status}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#150e24] to-transparent"></div>

          </div>

          <div className="p-8 space-y-6">

            <div className="flex justify-between items-start">

              <div>

                <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-[#bc66ff] transition-colors">
                  {v.name}
                </h3>

                <p className="text-[9px] text-gray-600 font-bold tracking-widest uppercase">
                  ID: {v.id}
                </p>

              </div>

              <button className="text-gray-600 hover:text-white transition-colors">
                •••
              </button>

            </div>

            <div className="grid grid-cols-2 gap-y-4">

              <div>
                <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">
                  Speed
                </p>

                <p className="text-[10px] font-bold text-white/90">
                  {v.speed}
                </p>
              </div>

              <div>
                <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">
                  Destination
                </p>

                <p className="text-[10px] font-bold text-white/90 truncate pr-2">
                  {v.destination}
                </p>
              </div>

              <div>
                <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">
                  Registry
                </p>

                <p className="text-[10px] font-bold text-white/90">
                  2026-ACTIVE
                </p>
              </div>

              <div>
                <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">
                  Hull Integrity
                </p>

                <p className="text-[10px] font-bold text-white/90">
                  OPTIMAL
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-white/5 flex justify-between items-center">

              <span className="text-[8px] text-gray-600 font-bold italic uppercase">
                Current Status:{' '}
                {v.status === 'MAINTENANCE'
                  ? 'UNDER REPAIR'
                  : 'ACTIVE'}
              </span>

              <button className="text-[8px] font-black uppercase tracking-widest text-[#bc66ff] hover:underline hover:tracking-widest transition-all">
                Vessel Logs »
              </button>

            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

export default function VesselListPage() {

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // TAMBAHAN LOADING
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 3;

  const filteredVessels = vesselsList.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.id.includes(search)
  );

  const totalPages = Math.ceil(
    filteredVessels.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedVessels = filteredVessels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // TAMBAHAN DELAY
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-end">

        <div>

          <h1 className="text-4xl font-black uppercase tracking-tighter">
            All Vessels
          </h1>

          <div className="flex gap-4 mt-2">

            <select className="bg-[#150e24] border border-white/10 rounded-md px-3 py-1 text-[9px] font-bold text-gray-400 outline-none hover:border-[#bc66ff]/50 transition-all cursor-pointer">
              <option>STATUS: ALL UNITS</option>
              <option>STATUS: EN ROUTE</option>
              <option>STATUS: MAINTENANCE</option>
            </select>

            <select className="bg-[#150e24] border border-white/10 rounded-md px-3 py-1 text-[9px] font-bold text-gray-400 outline-none hover:border-[#bc66ff]/50 transition-all cursor-pointer">
              <option>YEAR: 2024-2026</option>
            </select>

          </div>
        </div>

        <div className="text-right">

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Operational Status
          </p>

          <p className="text-2xl font-black text-[#bc66ff]">
            98.2%
            <span className="text-[10px] text-gray-400 uppercase font-bold">
              {' '}
              Ready
            </span>
          </p>

        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-4">

        <div className="relative flex-1">

          <input
            type="text"
            placeholder="QUERY VESSEL ID OR NAME..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#150e24] border border-white/10 rounded-full py-3 px-12 text-[10px] font-bold focus:border-[#bc66ff] outline-none transition-all placeholder:text-gray-700"
          />

          <span className="absolute left-5 top-3 opacity-30 text-lg">
            🔍
          </span>

        </div>

      </div>

      {/* SUSPENSE */}
      <Suspense fallback={<VesselSkeleton />}>

        {loading ? (
          <VesselSkeleton />
        ) : (
          <VesselGrid paginatedVessels={paginatedVessels} />
        )}

      </Suspense>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 pt-8">

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          disabled={currentPage === 1}
          className="px-5 py-2 rounded-full border border-white/10 text-xs uppercase hover:border-[#bc66ff] disabled:opacity-30"
        >
          Prev
        </button>

        <div className="px-5 py-2 rounded-full bg-[#150e24] border border-white/10 text-xs uppercase tracking-widest">
          Page {currentPage} / {totalPages}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          disabled={currentPage === totalPages}
          className="px-5 py-2 rounded-full border border-white/10 text-xs uppercase hover:border-[#bc66ff] disabled:opacity-30"
        >
          Next
        </button>

      </div>
    </div>
  );
}