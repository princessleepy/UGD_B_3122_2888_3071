import {
  buildStatusDistribution,
  fetchVehicleStats,
  fetchVesselAudit,
} from '@/app/lib/data';
import AnalyticsDashboardClient from './AnalyticsDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [stats, vesselAudit] = await Promise.all([
    fetchVehicleStats(),
    fetchVesselAudit(),
  ]);

  const statusDistribution = buildStatusDistribution(stats);
  const topVessels = vesselAudit.slice(0, 6);
  const chartData = topVessels.map((v) => v.efficiency_score);
  const chartLabels = topVessels.map((v) =>
    v.vehicle_name.split(' ')[0].slice(0, 6),
  );

  return (
    <AnalyticsDashboardClient
      stats={stats}
      statusDistribution={statusDistribution}
      vesselAudit={vesselAudit}
      chartData={chartData}
      chartLabels={chartLabels}
    />
  );
}
