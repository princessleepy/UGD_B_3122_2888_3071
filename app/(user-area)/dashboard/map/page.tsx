'use client';

import React, {
  useState,
  useEffect,
  Suspense,
} from 'react';

import { MapSkeleton } from '@/app/ui/skeletons';
import { fetchAllVehiclesAction } from '@/app/lib/actions';

function ShipCard({
  name,
  id,
  status,
  speed,
  destination,
  statusColor
}: any) {

  return (
    <div className="p-5 border rounded-[1.8rem] transition-all duration-500 cursor-pointer bg-[#1a1126]/30 border-white/5 hover:bg-[#bc66ff]/5 hover:border-[#bc66ff]/30 group">

      <div className="flex justify-between items-start mb-4">

        <div>

          <h4 className="font-black text-xs tracking-wider uppercase text-gray-200 group-hover:text-[#bc66ff] transition-colors">
            {name}
          </h4>

          <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase">
            SIGNAL ID: {id}
          </p>

        </div>

        <span
          className={`text-[8px] font-black px-2 py-0.5 rounded border border-current bg-current/5 ${statusColor}`}
        >
          {status}
        </span>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="bg-black/30 p-3 rounded-xl border border-white/5">

          <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">
            Velocity
          </p>

          <p className="text-white text-[11px] font-bold">
            {speed}
          </p>

        </div>

        <div className="bg-black/30 p-3 rounded-xl border border-white/5">

          <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">
            Heading
          </p>

          <p className="text-white text-[10px] font-bold truncate uppercase">
            {destination}
          </p>

        </div>

      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch ((status ?? '').toUpperCase()) {
    case 'EN ROUTE':    return 'text-emerald-400';
    case 'IN PORT':     return 'text-indigo-400';
    case 'ANCHORAGE':   return 'text-amber-400';
    case 'MAINTENANCE': return 'text-rose-400';
    default:            return 'text-gray-400';
  }
}

function ShipList({ paginatedVessels }: any) {
  return (
    <>
      {paginatedVessels.length > 0 ? (
        paginatedVessels.map((ship: any) => (
          <ShipCard key={ship.id} {...ship} />
        ))
      ) : (
        <div className="text-center py-10 border border-dashed border-white/5 rounded-3xl">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            No Signal Found
          </p>
        </div>
      )}
    </>
  );
}

export default function MapPage() {

  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1.1);
  // All 12 vessels from DB (for the counter)
  const [allVessels, setAllVessels] = useState<any[]>([]);
  // Active vessels shown on map (exclude MAINTENANCE)
  const [vesselData, setVesselData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 2;

  useEffect(() => {
    fetchAllVehiclesAction().then((rows) => {
      const all = (rows as any[]);
      setAllVessels(all);

      // Map page shows all non-maintenance vessels
      const active = all
        .filter((v) => v.status !== 'MAINTENANCE')
        .map((vehicle) => ({
          id: vehicle.id,
          name: vehicle.vehicle_name,
          code: vehicle.vehicle_code,
          status: vehicle.status,
          speed: vehicle.status === 'EN ROUTE' ? '14.5 KN' : '0.0 KN',
          destination: vehicle.registry_status ?? '-',
          statusColor: getStatusColor(vehicle.status),
        }));
      setVesselData(active);
    });
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 1));

  const filteredVessels = vesselData.filter(ship =>
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVessels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVessels = filteredVessels.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden p-6 pt-0 flex flex-col font-mono">

      {/* HEADER */}
      <div className="mb-4 pt-4">
        <h2 className="text-white text-2xl font-black uppercase tracking-tighter leading-none">
          Global Map
        </h2>
        <p className="text-[10px] text-[#bc66ff] font-bold tracking-widest flex items-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#bc66ff] animate-pulse"></span>
          LIVE TELEMETRY // {allVessels.length} UNITS DETECTED
          <span className="text-gray-600 font-normal">
            · {vesselData.length} ACTIVE ON MAP
          </span>
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-grow grid grid-cols-12 gap-10 min-h-0">

        {/* MAP */}
        <div className="col-span-8 flex flex-col min-h-0">
          <div className="flex-grow bg-[#150e24] rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-2xl">
            <div
              className="w-full h-full transition-transform duration-500 ease-out origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://maps.google.com/maps?q=-6.1214,106.8744&t=k&z=4&ie=UTF8&iwloc=&output=embed"
                className="grayscale invert contrast-125 opacity-20 brightness-50"
              ></iframe>
            </div>

            {/* ZOOM BUTTONS */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-10">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 bg-black/80 border border-white/10 rounded-xl text-white font-bold hover:bg-[#bc66ff] transition-all backdrop-blur-md flex items-center justify-center text-xl shadow-lg"
              >+</button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 bg-black/80 border border-white/10 rounded-xl text-white font-bold hover:bg-[#bc66ff] transition-all backdrop-blur-md flex items-center justify-center text-xl shadow-lg"
              >-</button>
            </div>

            {/* ACTIVE SECTOR */}
            <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-right">
              <p className="text-[7px] text-gray-500 uppercase font-black">Active Sector</p>
              <p className="text-[10px] text-[#bc66ff] font-bold">SOUTH-EAST ASIA / A1</p>
            </div>

            {/* Maintenance vessels excluded notice */}
            {allVessels.length > vesselData.length && (
              <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md border border-rose-500/20 p-3 rounded-2xl text-right">
                <p className="text-[7px] text-rose-400 uppercase font-black tracking-widest">
                  {allVessels.length - vesselData.length} VESSEL(S) IN MAINTENANCE — OFFLINE
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-4 flex flex-col min-h-0 space-y-5">

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="SCAN SIGNALS (NAME/ID)..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#1a1126]/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-[#bc66ff]/50 transition-all placeholder:text-gray-700"
            />
            <svg className="absolute left-4 top-4 text-gray-600" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          {/* SHIP LIST */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-0">
            <Suspense fallback={<MapSkeleton />}>
              {loading ? <MapSkeleton /> : <ShipList paginatedVessels={paginatedVessels} />}
            </Suspense>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase hover:border-[#bc66ff] disabled:opacity-30"
            >Prev</button>
            <div className="px-4 py-2 rounded-full bg-[#150e24] border border-white/10 text-[10px] uppercase tracking-widest">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
              className="px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase hover:border-[#bc66ff] disabled:opacity-30"
            >Next</button>
          </div>

          {/* REPORT BUTTON */}
          <button className="w-full py-4 bg-[#bc66ff] hover:bg-purple-400 text-black font-black text-[11px] rounded-2xl tracking-[0.2em] transition-all shrink-0 shadow-[0_0_20px_rgba(188,102,255,0.3)]">
            GENERATE FLEET REPORT
          </button>

        </div>
      </div>
    </div>
  );
}
