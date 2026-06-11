import { generatePageMetadata } from '@/app/lib/metadata';
import { redirect } from 'next/navigation';
import { validateSession } from '@/app/lib/actions';
import { fetchAllVehicles, getFleetStats } from '@/app/lib/data';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Maritime analytics overview',
  keywords: ['dashboard', 'analytics', 'overview', 'maritime'],
});

const defaultStats = {
  total: 0, en_route: 0, in_port: 0, anchorage: 0, maintenance: 0, readiness: 0
};

export default async function DashboardPage() {
  const session = await validateSession();
  if (!session.success) {
    redirect('/login');
  }

  // Fetch data - error ditangkap masing-masing agar satu gagal tidak block semua
  let vehicles: any[] = [];
  let stats = defaultStats;
  let dbError = false;

  try {
    const results = await Promise.all([
      fetchAllVehicles(),
      getFleetStats(),
    ]);
    vehicles = results[0] as any[];
    stats = results[1] as any;
    dbError = vehicles.length === 0 && stats.total === 0;
  } catch (err) {
    console.error('[Dashboard] DB fetch error:', err);
    dbError = true;
  }

  return <DashboardClient vehicles={vehicles} stats={stats} dbError={dbError} />;
}
