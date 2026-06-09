import { fetchVehicleStats, fetchVesselsForMap } from '@/app/lib/data';
import MapClient from './MapClient';

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const [vessels, stats] = await Promise.all([
    fetchVesselsForMap(),
    fetchVehicleStats(),
  ]);

  return <MapClient vessels={vessels} stats={stats} />;
}
