import {
  fetchFilteredVehicles,
  fetchVehiclePages,
} from '@/app/lib/data';

import VesselClient from './VesselClient';
import { generateVehicleCode, deleteVessel } from '@/app/lib/actions';

export const dynamic = 'force-dynamic';

export default async function VesselListPage(props: {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const status = searchParams?.status || 'ALL';
  const currentPage = Number(searchParams?.page) || 1;
  
  // ✅ Fetch data vessels
  const vehicles = await fetchFilteredVehicles(query, status, currentPage);
  const totalPages = await fetchVehiclePages(query, status);
  
  // ✅ Generate next vehicle code untuk modal
  const nextVehicleCode = await generateVehicleCode();
  
  // ✅ Pagination URLs
  const previousPageUrl = `/dashboard/fleet/vessels?query=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}&page=${Math.max(currentPage - 1, 1)}`;
  const nextPageUrl = `/dashboard/fleet/vessels?query=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}&page=${Math.min(currentPage + 1, totalPages || 1)}`;

  return (
    <VesselClient
      vehicles={vehicles}
      totalPages={totalPages}
      currentPage={currentPage}
      query={query}
      status={status}
      previousPageUrl={previousPageUrl}
      nextPageUrl={nextPageUrl}
      deleteAction={deleteVessel}
      nextVehicleCode={nextVehicleCode}
    />
  );
}