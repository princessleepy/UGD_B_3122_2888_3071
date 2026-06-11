import { fetchAllVehicles, getFleetStats } from '@/app/lib/data';
import FleetPageClient from './FleetPageClient';

export const dynamic = 'force-dynamic';

export default async function FleetPage() {
  const [vehicles, stats] = await Promise.all([
    fetchAllVehicles(),
    getFleetStats(),
  ]);

  return <FleetPageClient vehicles={vehicles as any[]} stats={stats as any} />;
}
