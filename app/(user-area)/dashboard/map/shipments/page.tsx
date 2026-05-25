import Link from 'next/link';

import {
  fetchFilteredShipmentTransactions,
  fetchShipmentTransactionPages,
} from '@/app/lib/data';

import { deleteShipmentTransaction } from '@/app/lib/actions';

export default async function ActiveShipmentsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const shipments = await fetchFilteredShipmentTransactions(
    query,
    currentPage
  );

  const totalPages = await fetchShipmentTransactionPages(query);

  const previousPageUrl = `/dashboard/map/shipments?query=${encodeURIComponent(
    query
  )}&page=${Math.max(currentPage - 1, 1)}`;

  const nextPageUrl = `/dashboard/map/shipments?query=${encodeURIComponent(
    query
  )}&page=${Math.min(currentPage + 1, totalPages || 1)}`;

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white/90">
            Active Shipments
          </h1>

          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1">
            REAL-TIME GLOBAL LOGISTICS MONITORING V4.0
          </p>
        </div>

        <div className="flex gap-4">
          <div className="text-right bg-[#150e24] p-3 px-6 rounded-2xl border border-white/5 shadow-xl">
            <p className="text-[8px] text-gray-500 font-bold uppercase">
              Total Pages
            </p>

            <p className="text-xl font-black">
              {totalPages || 1}
            </p>
          </div>

          <Link
            href="/dashboard/map/shipments/create"
            className="bg-[#bc66ff] text-black px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
          >
            + New Shipment
          </Link>
        </div>
      </div>

      <form className="flex justify-between items-center px-4 gap-4">
        <div className="relative w-full max-w-md">
          <input
            name="query"
            type="text"
            placeholder="SEARCH TRACKING NO / SENDER / RECEIVER / ITEM..."
            defaultValue={query}
            className="bg-[#150e24] border border-white/10 rounded-full py-2.5 px-10 text-[9px] font-bold w-full focus:border-[#bc66ff] transition-all outline-none"
          />

          <span className="absolute left-4 top-3 text-gray-600">
            🔍
          </span>
        </div>

        <button
          type="submit"
          className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          Search
        </button>

        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          Page {currentPage} / {totalPages || 1}
        </span>
      </form>

      <div className="bg-[#150e24]/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead className="text-gray-600 uppercase font-black tracking-widest border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="px-8 py-6">Tracking No.</th>
                <th className="px-8 py-6">Sender</th>
                <th className="px-8 py-6">Receiver</th>
                <th className="px-8 py-6">Cargo</th>
                <th className="px-8 py-6">Route</th>
                <th className="px-8 py-6">Vehicle</th>
                <th className="px-8 py-6 text-right">Price</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {shipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="group hover:bg-[#bc66ff]/5 transition-all"
                >
                  <td className="px-8 py-5 font-bold text-gray-500 group-hover:text-[#bc66ff] transition-colors">
                    {shipment.tracking_number}
                  </td>

                  <td className="px-8 py-5">
                    <p className="font-black uppercase">
                      {shipment.sender_name}
                    </p>

                    <p className="text-[8px] text-gray-600">
                      {shipment.phone_number}
                    </p>
                  </td>

                  <td className="px-8 py-5 font-bold uppercase text-gray-300">
                    {shipment.receiver_name}
                  </td>

                  <td className="px-8 py-5">
                    <p className="font-black uppercase">
                      {shipment.item_name}
                    </p>

                    <p className="text-[8px] text-gray-600">
                      {shipment.item_type} / {shipment.item_weight} KG
                    </p>
                  </td>

                  <td className="px-8 py-5 text-gray-400 font-bold italic uppercase">
                    {shipment.origin_city} → {shipment.destination_city}
                  </td>

                  <td className="px-8 py-5">
                    <p className="font-black uppercase">
                      {shipment.vehicle_name}
                    </p>

                    <p className="text-[8px] text-gray-600">
                      {shipment.vehicle_type}
                    </p>
                  </td>

                  <td className="px-8 py-5 font-black text-right">
                    Rp {Number(shipment.price).toLocaleString('id-ID')}
                  </td>

                  <td className="px-8 py-5">
                    <div
                      className={`px-4 py-1.5 rounded-full text-center block font-black tracking-tighter shadow-sm border ${
                        shipment.shipment_status === 'DELAYED'
                          ? 'text-rose-500 border-rose-500/30 bg-rose-500/5'
                          : shipment.shipment_status === 'ARRIVED'
                            ? 'text-indigo-400 border-indigo-400/30 bg-indigo-400/5'
                            : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                      }`}
                    >
                      {shipment.shipment_status}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/map/shipments/${shipment.id}/edit`}
                        className="text-[#bc66ff] hover:text-white font-black uppercase"
                      >
                        Edit
                      </Link>

                      <form
                        action={deleteShipmentTransaction.bind(
                          null,
                          shipment.id
                        )}
                      >
                        <button
                          type="submit"
                          className="text-rose-500 hover:text-white font-black uppercase"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {shipments.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-8 py-10 text-center text-gray-600 font-black uppercase tracking-[0.2em]"
                  >
                    No shipment data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 pt-4">
        <Link
          href={previousPageUrl}
          className={`px-8 py-3 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] ${
            currentPage <= 1
              ? 'pointer-events-none opacity-40'
              : 'hover:bg-white hover:text-black'
          }`}
        >
          Prev
        </Link>

        <span className="px-8 py-3 rounded-full border border-white/10 text-[9px] font-black">
          {currentPage} / {totalPages || 1}
        </span>

        <Link
          href={nextPageUrl}
          className={`px-8 py-3 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] ${
            currentPage >= totalPages
              ? 'pointer-events-none opacity-40'
              : 'hover:bg-white hover:text-black'
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}