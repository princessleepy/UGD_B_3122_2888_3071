'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/profile', label: 'Profile' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
      <nav className="flex justify-between items-center px-8 py-4 bg-[#0d0716]/80 border-b border-white/5 backdrop-blur-md text-white font-mono">
        <div className="flex items-center text-[#d095ff] font-bold tracking-[0.4em] text-[11px] uppercase">
          PT. SAMUDRA TECHNOLOGY NUSANTARA
        </div>
        <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative pb-1 transition-all duration-300 ${
                isActive(href) ? 'text-[#d095ff]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
              {isActive(href) && (
                <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#d095ff] rounded-full shadow-[0_0_12px_#d095ff]" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center pr-2">
            <div
              className="relative cursor-pointer group"
              onClick={() => router.push('/admin/alerts')}
            >
              <BellIcon className={`w-5 transition-colors ${pathname.startsWith('/admin/alerts') ? 'text-[#d095ff]' : 'text-gray-400 group-hover:text-white'}`} />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0716] animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <div className="flex flex-col items-end">
              <span className="text-white text-[11px] font-bold uppercase tracking-tight">BUDI SANTOSO</span>
              <span className="text-[#d095ff] text-[8px] font-black tracking-widest uppercase opacity-80">ADMIN</span>
            </div>
            
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#d095ff] flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-white/20">
              <span className="text-white text-xs font-black">BS</span>
            </div>
          </div>


          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all active:scale-95"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {showLogout && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md font-mono">
          <div className="bg-[#130921] border border-white/10 rounded-[2rem] p-10 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center ring-1 ring-white/5">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl border border-[#d095ff]/20 flex items-center justify-center bg-[#d095ff]/5">
                <ArrowRightOnRectangleIcon className="w-8 h-8 text-[#d095ff]" />
              </div>
            </div>

            <h3 className="text-white font-bold text-sm tracking-[0.1em] uppercase mb-3">
              Terminate Session?
            </h3>

            <p className="text-gray-500 text-[10px] leading-relaxed mb-8 uppercase tracking-tighter">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-4 rounded-xl tracking-[0.2em] uppercase transition-all"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[10px] font-bold py-4 rounded-xl tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(124,58,237,0.3)] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}