"use client";

export default function MetricCard({
  title,
  value,
  subtitle,
  statusType, 
}: any) {
  
  const isWarning = statusType === "warning";

  return (
    <div className={`rounded-2xl p-6 backdrop-blur-md border transition-all duration-500 ${
      isWarning 
        ? "bg-gradient-to-br from-rose-900/40 to-rose-800/20 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]" 
        : "bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-white/10 shadow-lg"
    }`}>
      <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
        {title}
      </p>

      <h2 className={`text-3xl font-black mt-2 tracking-tighter ${
        isWarning ? "text-rose-500" : "text-white"
      }`}>
        {value}
      </h2>

      {subtitle && (
        <p className={`text-[10px] font-bold mt-3 flex items-center gap-1 uppercase ${
          isWarning ? "text-rose-400" : "text-pink-400"
        }`}>
          {isWarning && <span className="animate-pulse">⚠️</span>}
          {subtitle}
        </p>
      )}
    </div>
  );
}