import { fetchMaintenanceVessels, fetchVehicleStats } from '@/app/lib/data';
import MaintenanceClient from './MaintenanceClient';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const [maintenanceVessels, stats] = await Promise.all([
    fetchMaintenanceVessels(),
    fetchVehicleStats(),
  ]);

  return (
    <MaintenanceClient maintenanceVessels={maintenanceVessels} stats={stats} />
  );
}
