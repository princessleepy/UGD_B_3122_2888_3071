import {
  buildStatusDistribution,
  fetchMaintenanceVessels,
  fetchVehicleStats,
} from '@/app/lib/data';
import FleetAnalyticsClient from './FleetAnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function MaintenanceAnalyticsPage() {
  try {
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
  } catch (error) {
    console.error('MaintenanceAnalyticsPage error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0415] text-white">
        <p className="text-center text-xl">Failed to load maintenance analytics. Please try again later.</p>
      </div>
    );
  }
}
