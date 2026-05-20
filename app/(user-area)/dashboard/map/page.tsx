'use client';
import React, { useState } from 'react';
import { mapVesselData as vesselData } from "@/app/lib/placeholder-data";

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1.1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 1));

  const filteredVessels = vesselData.filter(ship =>
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ship.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden p-6 pt-0 flex flex-col font-mono">
      <div className="mb-4 pt-4">
        <h2 className="text-white text-2xl font-black uppercase tracking-tighter leading-none">Global Map</h2>
        <p className="text-[10px] text-[#bc66ff] font-bold tracking-widest flex items-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#bc66ff] animate-pulse"></span>
          LIVE TELEMETRY // {vesselData.length} UNITS DETECTED
        </p>
      </div>

      <div className="flex-grow grid grid-cols-12 gap-10 min-h-0">
        <div className="col-span-8 flex flex-col min-h-0">
          <div className="flex-grow bg-[#150e24] rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-2xl">
            <div className="w-full h-full transition-transform duration-500 ease-out origin-center" style={{ transform: `scale(${zoom})` }}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=-6.1214,106.8744&t=k&z=4&ie=UTF8&iwloc=&output=embed" 
                className="grayscale invert contrast-125 opacity-20 brightness-50"
              ></iframe>
            </div>

            <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-10">
              <button onClick={handleZoomIn} className="w-10 h-10 bg-black/80 border border-white/10 rounded-xl text-white font-bold hover:bg-[#bc66ff] transition-all backdrop-blur-md flex items-center justify-center text-xl shadow-lg">+</button>
              <button onClick={handleZoomOut} className="w-10 h-10 bg-black/80 border border-white/10 rounded-xl text-white font-bold hover:bg-[#bc66ff] transition-all backdrop-blur-md flex items-center justify-center text-xl shadow-lg">-</button>
            </div>
            
            <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-right">
                <p className="text-[7px] text-gray-500 uppercase font-black">Active Sector</p>
                <p className="text-[10px] text-[#bc66ff] font-bold">SOUTH-EAST ASIA / A1</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col min-h-0 space-y-5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="SCAN SIGNALS (NAME/ID)..." 
              value={searchTerm} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1126]/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-[#bc66ff]/50 transition-all placeholder:text-gray-700"
            />
            <svg className="absolute left-4 top-4 text-gray-600" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>

          <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-0">
            {filteredVessels.length > 0 ? (
                filteredVessels.map((ship) => (
                    <ShipCard key={ship.id} {...ship} />
                ))
            ) : (
                <div className="text-center py-10 border border-dashed border-white/5 rounded-3xl">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">No Signal Found</p>
                </div>
            )}
          </div>
          
          <button className="w-full py-4 bg-[#bc66ff] hover:bg-purple-400 text-black font-black text-[11px] rounded-2xl tracking-[0.2em] transition-all shrink-0 shadow-[0_0_20px_rgba(188,102,255,0.3)]">
            GENERATE FLEET REPORT
          </button>
        </div>
      </div>
    </div>
  );
}

function ShipCard({ name, id, status, speed, destination, statusColor }: any) {
  return (
    <div className={`p-5 border rounded-[1.8rem] transition-all duration-500 cursor-pointer bg-[#1a1126]/30 border-white/5 hover:bg-[#bc66ff]/5 hover:border-[#bc66ff]/30 group`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-black text-xs tracking-wider uppercase text-gray-200 group-hover:text-[#bc66ff] transition-colors">{name}</h4>
          <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase">SIGNAL ID: {id}</p>
        </div>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded border border-current bg-current/5 ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/30 p-3 rounded-xl border border-white/5">
          <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Velocity</p>
          <p className="text-white text-[11px] font-bold">{speed}</p>
        </div>
        <div className="bg-black/30 p-3 rounded-xl border border-white/5">
          <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">Heading</p>
          <p className="text-white text-[10px] font-bold truncate uppercase">{destination}</p>
        </div>
      </div>
    </div>
  );
}