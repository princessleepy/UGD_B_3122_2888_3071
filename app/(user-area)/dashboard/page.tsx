import { fetchAllVehicles } from '@/app/lib/data';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const vehicles = await fetchAllVehicles();

  return <DashboardClient vehicles={vehicles} />;
}