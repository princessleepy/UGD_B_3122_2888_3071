'use client';  // ✅ Perlu client component untuk pakai router

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0514] flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-9xl font-black text-rose-500">404</h1>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Maaf, halaman yang Anda cari belum ada
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          {/* ✅ Tombol Back - kembali ke halaman sebelumnya */}
          <button
            onClick={() => router.back()}
            className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
          >
            ← Kembali
          </button>
          
          {/* ✅ Tombol Dashboard - fallback jika back tidak berfungsi */}
          <Link
            href="/dashboard"
            className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}