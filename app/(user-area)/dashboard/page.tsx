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
  const [vehicles, stats] = await Promise.all([
    fetchAllVehicles(),
    fetchVehicleStats(),
  ]);

  return <DashboardClient vehicles={vehicles} stats={stats} />;
}