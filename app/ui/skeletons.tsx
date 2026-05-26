// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="rounded-xl bg-gray-100 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
        <div className="bg-white px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function VesselSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#150e24]"
        >
          <div className="h-48 bg-gradient-to-b from-[#24143d] to-[#150e24]" />

          <div className="space-y-6 p-8">
            <div className="space-y-3">
              <div className="h-5 w-40 rounded bg-[#24143d]" />
              <div className="h-3 w-24 rounded bg-[#24143d]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((box) => (
                <div key={box} className="space-y-2">
                  <div className="h-2 w-16 rounded bg-[#24143d]" />
                  <div className="h-3 w-20 rounded bg-[#24143d]" />
                </div>
              ))}
            </div>

            <div className="h-8 rounded bg-[#24143d]" />
          </div>
        </div>
      ))}
    </div>
  );
  
}

export function MapSkeleton() {
  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden p-6 pt-0 flex flex-col font-mono animate-pulse">

      <div className="mb-4 pt-4 space-y-3">
        <div className="h-8 w-52 rounded bg-[#24143d]" />
        <div className="h-3 w-40 rounded bg-[#24143d]" />
      </div>

      <div className="flex-grow grid grid-cols-12 gap-10 min-h-0">

        <div className="col-span-8">
          <div className="h-full rounded-[2.5rem] bg-[#150e24] border border-white/5" />
        </div>

        <div className="col-span-4 flex flex-col gap-5">

          <div className="h-14 rounded-2xl bg-[#150e24]" />

          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-[150px] rounded-[1.8rem] bg-[#150e24] border border-white/5"
            />
          ))}

          <div className="flex justify-center gap-3">
            <div className="h-10 w-20 rounded-full bg-[#150e24]" />
            <div className="h-10 w-20 rounded-full bg-[#150e24]" />
            <div className="h-10 w-20 rounded-full bg-[#150e24]" />
          </div>

          <div className="h-14 rounded-2xl bg-[#bc66ff]/20" />

        </div>

      </div>
    </div>
  );
}

export function MaintenanceAnalyticsDetailSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#0a0514] text-white font-mono p-6 lg:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div className="h-10 w-72 rounded-xl bg-[#150e24] animate-pulse" />
          <div className="h-3 w-80 max-w-full rounded bg-[#150e24] animate-pulse" />
        </div>

        <div className="w-44 h-16 rounded-2xl bg-[#150e24] border border-white/5 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[170px] rounded-[2rem] bg-[#150e24] border border-white/5 animate-pulse"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#150e24]/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="h-4 w-56 rounded bg-[#211533] animate-pulse" />
            <div className="h-8 w-28 rounded-full bg-[#211533] animate-pulse" />
          </div>

          <div className="p-8 space-y-6">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-1 md:grid-cols-[1.4fr_0.7fr_1.4fr_0.7fr] items-center gap-5"
              >
                <div className="space-y-3">
                  <div className="h-4 w-40 rounded bg-[#211533] animate-pulse" />
                  <div className="h-3 w-28 rounded bg-[#211533] animate-pulse" />
                </div>

                <div className="h-8 w-24 rounded-xl bg-[#211533] animate-pulse" />

                <div className="h-2 w-full rounded-full bg-[#211533] animate-pulse" />

                <div className="space-y-2 md:justify-self-end">
                  <div className="h-3 w-16 rounded bg-[#211533] animate-pulse" />
                  <div className="h-2 w-12 rounded bg-[#211533] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#150e24] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center">
            <div className="h-4 w-40 rounded bg-[#211533] animate-pulse mb-10" />
            <div className="w-52 h-52 rounded-full bg-[#211533] animate-pulse" />
          </div>

          <div className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8">
            <div className="h-4 w-44 rounded bg-[#211533] animate-pulse mb-8" />

            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div className="flex justify-between mb-2">
                    <div className="h-3 w-20 rounded bg-[#211533] animate-pulse" />
                    <div className="h-3 w-16 rounded bg-[#211533] animate-pulse" />
                  </div>

                  <div className="h-2 w-full rounded-full bg-[#211533] animate-pulse" />
                </div>
              ))}
            </div>

            <div className="w-full h-14 rounded-2xl bg-[#211533] animate-pulse mt-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsDashboardSkeleton() {
  return (
    <div className="w-full bg-[#0a0514] min-h-screen">
      <div className="px-10 pt-6">
        <div className="space-y-2 mb-8">
          <div className="h-10 w-72 rounded bg-[#150e24] animate-pulse" />
          <div className="h-4 w-80 rounded bg-[#150e24] animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[145px] rounded-[2rem] bg-[#150e24] border border-white/5 animate-pulse"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 h-[400px] rounded-[2.5rem] bg-[#150e24] border border-white/5 animate-pulse" />
          <div className="h-[400px] rounded-[2.5rem] bg-[#150e24] border border-white/5 animate-pulse" />
        </div>

        <div className="rounded-[2.5rem] bg-[#150e24] border border-white/5 overflow-hidden mb-10 animate-pulse">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="h-4 w-40 rounded bg-[#24143d]" />
            <div className="h-10 w-44 rounded-lg bg-[#24143d]" />
          </div>

          <div className="p-8 space-y-6">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-6 items-center"
              >
                <div className="space-y-2">
                  <div className="h-3 w-40 rounded bg-[#24143d]" />
                  <div className="h-2 w-24 rounded bg-[#24143d]" />
                </div>

                <div className="h-2 w-32 rounded bg-[#24143d]" />
                <div className="h-3 w-24 rounded bg-[#24143d]" />
                <div className="h-3 w-24 rounded bg-[#24143d]" />
                <div className="h-7 w-28 rounded-lg bg-[#24143d] md:justify-self-end" />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 px-8 py-6 border-t border-white/5">
            <div className="h-8 w-16 rounded-full bg-[#24143d]" />
            <div className="h-8 w-16 rounded-full bg-[#24143d]" />
            <div className="h-8 w-16 rounded-full bg-[#24143d]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PerformanceAnalyticsSkeleton() {
  return (
    <div className="w-full">
      <div className="px-10 pt-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-2">
            <div className="h-8 w-72 rounded bg-[#1a0b2e]/70 animate-pulse" />
            <div className="h-3 w-96 rounded bg-[#1a0b2e]/70 animate-pulse" />
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[145px] rounded-[20px] bg-[#1a0b2e]/50 border border-white/5 animate-pulse"
            />
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-[400px] rounded-[20px] bg-[#1a0b2e]/50 border border-white/5 animate-pulse" />

          <div className="h-[400px] rounded-[20px] bg-[#1a0b2e]/50 border border-white/5 animate-pulse" />
        </div>

        {/* TABLE */}
        <div className="rounded-[20px] bg-[#1a0b2e]/50 border border-white/5 overflow-hidden mb-10 animate-pulse">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="h-4 w-44 rounded bg-[#2a1642]" />
            <div className="h-3 w-20 rounded bg-[#2a1642]" />
          </div>

          <div className="p-8 space-y-6">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6 items-center"
              >
                <div className="space-y-2">
                  <div className="h-3 w-40 rounded bg-[#2a1642]" />
                  <div className="h-2 w-24 rounded bg-[#2a1642]" />
                </div>

                <div className="h-2 w-32 rounded bg-[#2a1642]" />
                <div className="h-3 w-20 rounded bg-[#2a1642] md:justify-self-center" />
                <div className="h-6 w-24 rounded-full bg-[#2a1642] md:justify-self-end" />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 px-8 py-6 border-t border-white/5">
            <div className="h-8 w-16 rounded-full bg-[#2a1642]" />
            <div className="h-8 w-16 rounded-full bg-[#2a1642]" />
            <div className="h-8 w-16 rounded-full bg-[#2a1642]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShipmentSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8 animate-pulse">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="h-8 w-80 bg-[#150e24] rounded" />
          <div className="h-3 w-96 bg-[#150e24] rounded" />
        </div>

        <div className="flex gap-4">
          <div className="w-40 h-20 bg-[#150e24] rounded-2xl" />
          <div className="w-40 h-20 bg-[#150e24] rounded-2xl" />
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-[90px] bg-[#150e24] rounded-[2rem]" />
        <div className="h-[90px] bg-[#150e24] rounded-[2rem]" />
        <div className="h-[90px] bg-[#150e24] rounded-[2rem]" />
      </div>

      {/* SEARCH */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="h-10 w-72 bg-[#150e24] rounded-full" />
          <div className="h-6 w-24 bg-[#150e24] rounded" />
        </div>

        <div className="h-4 w-40 bg-[#150e24] rounded" />
      </div>

      {/* TABLE */}
      <div className="bg-[#150e24]/40 border border-white/5 rounded-[2.5rem] overflow-hidden">

        <div className="p-6 border-b border-white/5">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 bg-[#1c1230] rounded" />
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 p-5">
              <div className="h-3 bg-[#1c1230] rounded" />
              <div className="h-3 bg-[#1c1230] rounded" />
              <div className="h-3 bg-[#1c1230] rounded" />
              <div className="h-3 bg-[#1c1230] rounded" />
              <div className="h-3 bg-[#1c1230] rounded" />
              <div className="h-3 bg-[#1c1230] rounded" />
              <div className="h-6 bg-[#1c1230] rounded-full" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}



export function FleetSkeleton() {
  return (
    <div className="w-full bg-[#0a0514] min-h-screen text-white">
      <div className="p-8 pt-4 space-y-6 animate-pulse">

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[120px] bg-[#150e24] border border-white/5 rounded-3xl"
            />
          ))}
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center px-2">
          <div className="h-4 w-56 bg-[#150e24] rounded" />

          <div className="flex gap-2">
            <div className="h-6 w-24 bg-[#150e24] rounded-full" />
            <div className="h-6 w-8 bg-[#150e24] rounded" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#150e24]/30 border border-white/5 rounded-[2.5rem] overflow-hidden">

          {/* HEADER TABLE */}
          <div className="bg-white/5 border-b border-white/5 px-8 py-5">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-3 bg-[#1c1230] rounded"
                />
              ))}
            </div>
          </div>

          {/* ROWS */}
          <div className="divide-y divide-white/5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-4 px-8 py-5 items-center"
              >
                <div className="h-3 bg-[#1c1230] rounded" />
                <div className="h-3 bg-[#1c1230] rounded" />
                <div className="h-3 bg-[#1c1230] rounded" />
                <div className="h-6 w-24 bg-[#1c1230] rounded-full" />
                <div className="h-3 bg-[#1c1230] rounded ml-auto w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* FLOAT BUTTON */}
        <div className="fixed bottom-8 right-8">
          <div className="w-12 h-12 bg-[#150e24] rounded-full" />
        </div>

      </div>
    </div>
  );
}

export function MaintenanceSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8 animate-pulse">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-9 w-72 bg-[#150e24] rounded" />
          <div className="h-3 w-96 bg-[#150e24] rounded" />
        </div>

        <div className="h-11 w-64 bg-[#150e24] rounded-full" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-[130px] bg-[#150e24] rounded-3xl" />
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-12 lg:col-span-8 space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-40 bg-[#211533] rounded" />
              <div className="h-2 w-full bg-[#211533] rounded-full" />
              <div className="h-3 w-32 bg-[#211533] rounded" />
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-4 h-[300px] bg-[#150e24] rounded-[2.5rem]" />

      </div>

    </div>
  );
}


export function UserDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0d0415] text-white p-6 font-mono">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[112px] bg-[#1a0b2e] rounded-[20px] border border-white/5 shadow-lg animate-pulse"
          />
        ))}
      </div>

      {/* MAP + ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="h-4 w-48 rounded bg-[#1a0b2e] mb-4 animate-pulse" />

          <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 relative h-[450px] overflow-hidden shadow-2xl animate-pulse">
            <div className="absolute top-6 left-6 z-20 h-9 w-64 rounded-full bg-black/60 border border-white/10" />

            <div className="absolute inset-0 bg-gradient-to-br from-[#24143d] via-[#1a0b2e] to-black opacity-70" />

            <div className="absolute bottom-8 right-8 z-20 w-72 h-32 bg-black/60 rounded-[2rem] border border-white/10" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-40 rounded bg-[#1a0b2e] animate-pulse" />
            <div className="h-5 w-20 rounded-sm bg-rose-600/60 animate-pulse" />
          </div>

          <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 p-6 flex-grow shadow-lg overflow-y-auto max-h-[450px]">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[92px] rounded-r-2xl border-l-2 border-[#bc66ff] bg-[#bc66ff]/5 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE + PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl animate-pulse">
          <div className="p-8 flex justify-between items-center">
            <div className="h-4 w-44 rounded bg-[#2a1642]" />
            <div className="h-10 w-64 rounded-xl bg-black/40 border border-white/10" />
          </div>

          <div className="h-12 bg-white/5" />

          <div className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-4 gap-4 px-8 py-5"
              >
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded bg-[#2a1642]" />
                  <div className="h-2 w-20 rounded bg-[#2a1642]" />
                </div>

                <div className="h-3 w-24 rounded bg-[#2a1642]" />
                <div className="h-3 w-20 rounded bg-[#2a1642]" />
                <div className="h-3 w-36 rounded bg-[#2a1642]" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-4 w-48 rounded bg-[#1a0b2e] animate-pulse" />

          <div className="bg-[#1a0b2e] rounded-[2.5rem] border border-white/5 p-8 flex-grow shadow-lg animate-pulse">
            <div className="flex items-end justify-between h-40 gap-2 mb-8 px-2 border-b border-white/5 pb-2">
              {[45, 65, 50, 95, 70, 55, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-t-lg bg-white/10"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="h-[84px] bg-black/40 rounded-2xl border border-white/5" />
              <div className="h-[84px] bg-black/40 rounded-2xl border border-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//admin
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-[194px] bg-[#1a0b2e]/80 rounded-[20px] border border-white/5 animate-pulse"
        >
          <div className="p-6 space-y-6">
            <div className="w-10 h-10 rounded-xl bg-[#d095ff]/10" />
            <div className="space-y-3">
              <div className="h-3 w-28 rounded bg-[#2a1642]" />
              <div className="h-7 w-12 rounded bg-[#2a1642]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#1a0b2e]/80 p-6 rounded-[24px] border border-white/5 animate-pulse">
        <div className="h-4 w-48 rounded bg-[#2a1642] mb-8" />

        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#d095ff]/50" />

              <div className="space-y-2 flex-1">
                <div className="h-3 w-64 rounded bg-[#2a1642]" />
                <div className="h-2 w-40 rounded bg-[#2a1642]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a0b2e]/80 p-6 rounded-[24px] border border-white/5 animate-pulse">
        <div className="h-4 w-48 rounded bg-[#2a1642] mb-8" />

        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between">
              <div className="h-3 w-28 rounded bg-[#2a1642]" />
              <div className="h-3 w-20 rounded bg-[#2a1642]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0d0415] text-white p-6 font-mono">
      <div className="mb-8 space-y-3 animate-pulse">
        <div className="h-7 w-64 rounded bg-[#1a0b2e]" />
        <div className="h-3 w-72 rounded bg-[#1a0b2e]" />
      </div>

      <StatsSkeleton />
      <ActivitySkeleton />
    </div>
  );
}