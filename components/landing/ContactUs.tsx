'use client';

export default function ContactUs() {
  const contactInfo = [
    {
      label: "OFFICIAL EMAIL",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
      ),
      details: ["info@samudratech.co.id"]
    },
    {
      label: "DIRECT LINE",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      ),
      details: ["(0283) 1234567"]
    },
    {
      label: "SECURE WHATSAPP",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9.9L21 4.5z"/></svg>
      ),
      details: ["+62 812 3456 7890"]
    },
    {
      label: "DEEP TECH HUB",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      ),
      details: ["Samudra Tower, 15th Floor", "Jl. Thamrin No. 88, Jakarta 10350", "Indonesia"]
    },
    {
      label: "OPERATION HOURS",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ),
      details: ["Monday - Friday: 09:00 - 17:00 WIB", "Saturday - Sunday: Closed"]
    }
  ];

  return (
    <section id="contact" className="w-full bg-[#0a0514] text-white pt-36 pb-28 px-6 md:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="flex flex-col">
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-gray-500 mb-2">
              GET IN TOUCH
            </span>
            <h2 className="text-5xl md:text-6xl font-bold mb-14 tracking-tight uppercase">
              CONTACT US
            </h2>

            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-[#110a26]/50 border border-white/10 p-5 flex items-start gap-6 transition-all"
                >
                  <div className="bg-[#8b2fc9] p-2.5 rounded-sm shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-gray-500 block mb-1 uppercase">
                      {item.label}
                    </span>
                    <div className="text-sm md:text-base font-mono text-gray-200 leading-relaxed">
                      {item.details.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-full flex items-center justify-center lg:mt-12">
            <div className="w-full h-[600px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2000" 
                alt="Workspace" 
                className="w-full h-full object-cover grayscale-[20%]" 
              />
            </div>
          </div>

        </div>

        <div className="mt-24 pt-8 border-t border-white/5 text-[9px] text-white/30 tracking-[0.2em] uppercase">
          © 2026 PT SAMUDRA TECHNOLOGY NUSANTARA. ALL RIGHTS RESERVED.
        </div>
      </div>
    </section>
  );
}