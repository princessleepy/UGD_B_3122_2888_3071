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

// Fallback data jika database timeout
const defaultStats = {
  total: 0, en_route: 0, in_port: 0, anchorage: 0, maintenance: 0, readiness: 0
};

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  const timeout = new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms));
  return Promise.race([promise, timeout]);
}

export default async function DashboardPage() {
  const session = await validateSession();
  if (!session.success) {
    redirect('/login');
  }

  // Beri timeout 8 detik - jika DB tidak merespon, render dengan data kosong
  const [vehicles, stats] = await Promise.all([
    withTimeout(fetchAllVehicles(), 8000, []),
    withTimeout(getFleetStats(), 8000, defaultStats),
  ]);

  return <DashboardClient vehicles={vehicles as any} stats={stats as any} />;
}

