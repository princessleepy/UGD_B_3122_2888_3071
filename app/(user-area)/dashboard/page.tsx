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

export default async function DashboardPage() {
  const session = await validateSession();
  if (!session.success) {
    redirect('/login');
  }

  const [vehicles, stats] = await Promise.all([
    fetchAllVehicles(),
    getFleetStats(),
  ]);

  return <DashboardClient vehicles={vehicles as any} stats={stats as any} />;
}
