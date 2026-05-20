'use client';
import { robotoMono } from '@/app/ui/fonts';

export default function VisionMission() {
  const missions = [
    "To develop innovative, reliable, and user-friendly digital platforms for effective ship and maritime operations management.",
    "To provide real-time monitoring and data-driven insights that enable faster and more accurate decision-making.",
    "To enhance ship maintenance management through structured systems that ensure timely and efficient upkeep.",
    "To deliver excellent customer service and technical support, ensuring seamless system implementation and maximum value for users.",
    "To build an integrated maritime ecosystem by connecting vessels, ports, and stakeholders within a unified digital platform."
  ];

  return (
    <section id="vision-mission" className={`${robotoMono.className} min-h-screen w-full bg-[#0a051a] text-white pt-40 pb-20 px-10 md:px-20 relative`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a051a] via-[#4c1d95]/20 to-[#0a051a] pointer-events-none" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <div className="flex flex-col">
          <div className="mb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-purple-300 border-l-2 border-white pl-3">
              Our Vision
            </span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 tracking-tight uppercase">Vision</h2>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-purple-500/40">
            <p className="text-sm md:text-base leading-relaxed text-purple-100 opacity-90 italic">
              "To become a trusted and innovative maritime technology partner in Southeast Asia by delivering an integrated and intelligent ship management system that enhances efficiency, safety, and sustainability."
            </p>
          </div>
        </div>

        <div>
          <div className="mb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-purple-300 border-l-2 border-white pl-3">
              Our Mission
            </span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 tracking-tight uppercase">Mission</h2>
          </div>

          <div className="space-y-4">
            {missions.map((text, index) => (
              <div 
                key={index} 
                className="group bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex gap-5 items-start hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 shadow-xl"
              >
                <span className="text-[#bc66ff] font-black text-lg">{index + 1}.</span>
                <p className="text-sm md:text-base leading-relaxed text-purple-100 opacity-80 group-hover:opacity-100 transition-opacity duration-300 italic">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}