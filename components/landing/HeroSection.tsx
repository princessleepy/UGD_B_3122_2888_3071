'use client';
import React from 'react';
import Image from 'next/image'; 
import MyLogo from '@/public/logo.png'; 

export default function HeroSection() {
  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-[#0a051a] text-white font-sans">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1570114060235-979940bbad31?q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d0b4e]/90 via-[#1a0b2e]/80 to-[#0a051a]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 h-screen">
        <div className="mb-8 text-[#bc66ff] drop-shadow-[0_0_20px_rgba(188,102,255,0.6)]">
          <Image 
            src={MyLogo} 
            alt="Samudra Tech Logo"
            width={140}   
            height={140} 
            className="object-contain hover:scale-110 transition-transform duration-500" // Tambah efek hover dikit biar cakep
            priority 
          />
        </div>
        
        <h1 className="text-5xl md:text-[85px] font-[900] mb-6 tracking-tight leading-[1] text-[#f5f0ff]">
          PT. SAMUDRA <br /> 
          TECHNOLOGY <br /> 
          NUSANTARA
        </h1>
        
        <p className="text-[13px] md:text-[15px] font-medium tracking-[0.1em] mb-12 text-[#d8c5ff] opacity-80 uppercase">
          Pioneering Digital Maritime Solutions Across Southeast Asia
        </p>

        <button className="bg-[#8b2fc9] hover:bg-[#a13ee6] px-14 py-4 rounded-full font-black text-[12px] tracking-[0.2em] transition-all hover:scale-105 shadow-[0_0_30px_rgba(139,47,201,0.4)] uppercase">
          EXPLORE MORE
        </button>
      </main>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-50">
        <div className="w-5 h-9 border-[1.5px] border-white/60 rounded-full flex justify-center p-1.5">
          <div className="w-1 h-1.5 bg-white rounded-full animate-bounce" />
        </div>
      </div>

    </div>
  );
}