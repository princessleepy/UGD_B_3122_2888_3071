'use client';

import React from 'react';

export default function AboutSection() {
  const stats = [
    { label: "Clients", value: "50+" },
    { label: "Vessels", value: "200+" },
    { label: "Years", value: "10+" },
  ];

  return (
    <section 
      id="about" 
      className="relative h-screen w-full bg-[#0a051a] text-white flex items-center px-10 md:px-20 overflow-hidden"
    >
      <div className="absolute left-5 top-1/4 opacity-20 hidden md:block">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full transform -skew-x-12"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        <div>
          <span className="text-[#bc66ff] text-[10px] font-bold tracking-[0.3em] uppercase mb-3 block">
            Who We Are
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white uppercase leading-none">
            About Us
          </h2>
          
          <div className="space-y-4 text-[#d8c5ff] opacity-90 leading-relaxed text-sm md:text-base max-w-xl">
            <p>
              PT. Samudra Technology Nusantara is a technology company focused on developing digital solutions for the maritime sector. 
              By combining modern technology, continuous innovation, and a deep understanding of industry needs.
            </p>
            <p>
              We are committed to supporting the digital transformation of Indonesia's maritime industry by providing adaptive, integrated, and user-friendly solutions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-purple-900/40">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="relative group p-4 lg:p-6 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#bc66ff]/50 transition-all duration-300"
              >
                <div className="text-left">
                  <h3 className="text-2xl lg:text-3xl font-black text-[#bc66ff] tracking-tighter transition-transform duration-300 group-hover:scale-105 origin-left">
                    {stat.value}
                  </h3>
                  <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/60">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group hidden lg:block">
          <div className="absolute -inset-4 bg-purple-600/10 rounded-[2rem] blur-2xl group-hover:bg-[#bc66ff]/20 transition-all duration-500"></div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=2000" 
              alt="Maritime Industry" 
              className="w-full h-[400px] xl:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a051a]/80 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="absolute right-5 bottom-1/4 opacity-20 hidden md:block">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-1 bg-gradient-to-l from-[#bc66ff] to-transparent rounded-full transform skew-x-12 translate-x-4"></div>
          ))}
        </div>
      </div>
    </section>
  );
}