import SystemNavbar from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0415] text-gray-400 font-mono">
      <SystemNavbar />
      
      <main className="pt-20 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}