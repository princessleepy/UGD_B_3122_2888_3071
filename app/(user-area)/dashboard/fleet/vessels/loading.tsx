import { VesselSkeleton } from '@/app/ui/skeletons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8 pt-4 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-10 w-72 rounded bg-[#150e24] animate-pulse" />
          <div className="h-8 w-64 rounded bg-[#150e24] animate-pulse" />
        </div>

        <div className="h-16 w-40 rounded-2xl bg-[#150e24] animate-pulse" />
      </div>

      <div className="h-12 w-full rounded-full bg-[#150e24] animate-pulse" />

      <VesselSkeleton />

      <div className="flex justify-center gap-3 pt-8">
        <div className="h-9 w-20 rounded-full bg-[#150e24] animate-pulse" />
        <div className="h-9 w-28 rounded-full bg-[#150e24] animate-pulse" />
        <div className="h-9 w-20 rounded-full bg-[#150e24] animate-pulse" />
      </div>
    </div>
  );
}