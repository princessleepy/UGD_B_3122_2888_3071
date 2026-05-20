'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-[1001] transition-all duration-300 py-6 px-10 md:px-24 
      ${isScrolled ? 'bg-[#0a051a]/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex-shrink-0 text-3xl font-black tracking-tighter text-white cursor-pointer hover:opacity-80 transition-opacity">
          SAMUDRA<span className="text-[#bc66ff]">TECH</span>
        </Link>

        <div className="hidden md:flex gap-8 lg:gap-12 items-center justify-center flex-1">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/landing/about" },
            { name: "Vision & Mission", path: "/landing/visionmission" },
            { name: "Services", path: "/landing/ourservices" },
            { name: "Contact", path: "/landing/contactus" }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-xs lg:text-sm uppercase tracking-[0.2em] font-bold text-white/70 hover:text-[#bc66ff] transition-all hover:scale-105 whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex-shrink-0 hidden md:block">
          <Link 
            href="/login"
            className="bg-[#bc66ff] px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(188,102,255,0.3)] hover:shadow-[0_0_40px_rgba(188,102,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}