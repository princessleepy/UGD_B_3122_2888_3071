import {
  fetchPerformanceVessels,
  fetchTopVesselScores,
  fetchVehicleStats,
} from '@/app/lib/data';
import PerformanceClient from './PerformanceClient';

export const dynamic = 'force-dynamic';

function buildTrendData(readiness: string) {
  const base = Number(readiness) || 71.4;
  return Array.from({ length: 12 }, (_, i) => {
    const variance = Math.sin(i * 0.8) * 5 + (i % 3) * 2;
    return Math.min(100, Math.max(40, base + variance));
  });
}

export default async function PerformancePage() {
  const [stats, { vessels: allVessels }, topScores] = await Promise.all([
    fetchVehicleStats(),
    fetchPerformanceVessels(1, 14),
    fetchTopVesselScores(4),
  ]);

  const trendData = buildTrendData(stats.readiness);

  return (
    <PerformanceClient
      stats={stats}
      allVessels={allVessels}
      topScores={topScores}
      trendData={trendData}
    />
  );
}
