'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SubMenu {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  path: string;
  exact?: boolean;
  submenu?: SubMenu[];
}

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const user = { name: "Beni Maulana", role: "User", initials: "BM" };

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', exact: true },
    { 
      name: 'Fleet', 
      path: '/dashboard/fleet',
      submenu: [
        { name: 'Fleet Overview', path: '/dashboard/fleet' },
        { name: 'Vessel List', path: '/dashboard/fleet/vessels' },
        { name: 'Maintenance', path: '/dashboard/fleet/maintenance' },
      ]
    },
    { 
      name: 'Map', 
      path: '/dashboard/map',
      submenu: [
        { name: 'Global Map', path: '/dashboard/map' },
        { name: 'Active Shipments', path: '/dashboard/map/shipments' },
      ]
    },
    { 
      name: 'Analytics', 
      path: '/dashboard/analytics',
      submenu: [
        { name: 'General Analytics', path: '/dashboard/analytics' },
        { name: 'Maintenance Analytics', path: '/dashboard/analytics/maintenance' },
        { name: 'Performance Analytics', path: '/dashboard/analytics/performance' },
      ]
    }
  ];

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const isActive = (item: MenuItem) => {
    if (item.exact) return pathname === item.path;
    return pathname.startsWith(item.path);
  };

  const handleConfirmLogout = () => {
    router.push('/login');
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 h-20 z-[1000] flex justify-between items-center px-8 border-b border-purple-900/20 bg-[#0d0716]/80 backdrop-blur-md">
        <div className="w-1/4 text-[#bc66ff] font-bold uppercase tracking-[0.3em] text-[10px]">
          PT. Samudra Technology Nusantara
        </div>

        <nav className="flex justify-center gap-10 h-full text-[10px] font-bold uppercase tracking-[0.2em]">
          {menuItems.map((item) => {
            const active = isActive(item);
            return (
              <div 
                key={item.name} 
                className="relative h-full flex items-center group"
                onMouseEnter={() => item.submenu && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative py-1">
                  <Link 
                    href={item.path} 
                    className={`${active ? 'text-white' : 'text-gray-500 hover:text-white'} flex items-center gap-1 transition-all duration-300`}
                  >
                    {item.name}
                    {item.submenu && (
                      <svg className={`transition-transform duration-300 ${openDropdown === item.name ? 'rotate-180' : ''}`} width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    )}
                  </Link>
                  {active && (
                    <div className="absolute -bottom-2 inset-x-0 h-[2px] bg-[#bc66ff] shadow-[0_0_15px_#bc66ff] z-50 transition-all duration-300"></div>
                  )}
                </div>

                {item.submenu && openDropdown === item.name && (
                  <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-48 pt-2">
                    <div className="bg-[#150e24] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          className={`block px-4 py-3 text-[9px] border-b border-white/5 last:border-none transition-colors ${
                            pathname === sub.path ? 'text-[#bc66ff] bg-[#bc66ff]/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="w-1/4 flex justify-end items-center gap-4">
          <div className="flex items-center gap-4 pr-4 border-r border-white/10">
            <Link 
              href="/dashboard/alerts" 
              className={`relative transition-all duration-300 hover:scale-110 ${
                pathname === '/dashboard/alerts' ? 'text-[#bc66ff]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></span>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </Link>
          </div>

          <div className="flex items-center gap-3 pr-2">
            <div className="text-right leading-none">
              <p className="text-white text-[9px] font-black uppercase">{user.name}</p>
              <p className="text-[#bc66ff]/60 text-[7px] uppercase tracking-tighter mt-1">{user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bc66ff] to-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_15px_rgba(188,102,255,0.4)] border border-white/20">
              {user.initials}
            </div>
          </div>

          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 group"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative w-full max-w-sm bg-[#150e24] border border-white/10 rounded-[2.5rem] p-10 text-center shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
            <div className="mx-auto w-16 h-16 rounded-full border border-[#bc66ff]/30 bg-[#bc66ff]/10 flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bc66ff" strokeWidth="2.5">
                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold mb-4 tracking-tight">Initialize Terminal Termination?</h2>
            <p className="text-gray-400 text-[11px] leading-relaxed mb-10 px-2">
              Are you sure you want to logout? All active encryption tunnels for <span className="text-white font-semibold">SAMUDRA TECH</span> will be safely decommissioned.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-4 rounded-2xl bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="flex-1 py-4 rounded-2xl bg-[#7c3aed] text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:bg-[#6d28d9] transition-colors"
              >
                Logout
              </button>
            </div>
            <div className="mt-8 text-[8px] text-white/10 font-mono tracking-[0.3em]">
               AUTH-PROTOCOL-V4.0.1
            </div>
          </div>
        </div>
      )}
    </>
  );
}