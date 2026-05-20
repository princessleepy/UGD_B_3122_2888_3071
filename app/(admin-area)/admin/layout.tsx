import React from 'react';

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full min-h-screen bg-[#0d0415]">
      {children}
    </section>
  );
}