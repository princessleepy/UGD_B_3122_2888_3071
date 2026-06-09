import { generatePageMetadata } from '@/app/lib/metadata';
import { fetchAllVehicles, fetchVehicleStats } from '@/app/lib/data';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

//Metadata untuk halaman Dashboard
export const metadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Maritime analytics overview',
  keywords: ['dashboard', 'analytics', 'overview', 'maritime'],
});

export default async function DashboardPage() {
  try {
    const [vehicles, stats] = await Promise.all([
      fetchAllVehicles(),
      fetchVehicleStats(),
    ]);
    return <DashboardClient vehicles={vehicles} stats={stats} />;
  } catch (error) {
    console.error('DashboardPage error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0415] text-white">
        <p className="text-center text-xl">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }
}