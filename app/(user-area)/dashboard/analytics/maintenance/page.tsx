import {
  buildStatusDistribution,
  fetchMaintenanceVessels,
  fetchVehicleStats,
} from '@/app/lib/data';
import FleetAnalyticsClient from './FleetAnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function MaintenanceAnalyticsPage() {
  const [stats, maintenanceVessels] = await Promise.all([
    fetchVehicleStats(),
    fetchMaintenanceVessels(),
  ]);

  const statusDistribution = buildStatusDistribution(stats);

  return (
    <FleetAnalyticsClient
      stats={stats}
      statusDistribution={statusDistribution}
      maintenanceVessels={maintenanceVessels}
    />
  );
}
