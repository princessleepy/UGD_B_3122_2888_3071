'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/landing/Navbar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import AdminNav from "@/components/dashboard/AdminNav"; 
import "./global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAdminArea = pathname?.startsWith('/admin');
  const isUserArea = pathname?.startsWith('/dashboard');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body className="bg-[#0d0415] text-white m-0 p-0 min-h-screen">
        {isAdminArea ? (
          <AdminNav />
        ) : isUserArea ? (
          <DashboardNav />
        ) : (
          !isAuthPage && <Navbar />
        )}

        <main className="relative w-full pt-0">
          {children}
        </main>
        
      </body>
    </html>
  );
}