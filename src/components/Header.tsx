import { BRAND } from "@/config";

export default function Header({
  period,
  onRefresh,
  refreshing,
}: {
  period: string;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-red-900/40 bg-neutral-950/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-lg font-black tracking-tight text-white shadow-lg shadow-red-900/40 ring-1 ring-red-400/30">
          QG
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-extrabold uppercase leading-tight tracking-wide text-white sm:text-xl">
            {BRAND.name}
          </h1>
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.18em] text-red-500 sm:text-xs">
            {BRAND.tagline}
          </p>
        </div>

        {period && (
          <div className="hidden rounded-lg border border-red-700/50 bg-red-950/40 px-3 py-1.5 text-right sm:block">
            <div className="text-[10px] uppercase tracking-widest text-red-400">Rate List</div>
            <div className="text-sm font-bold text-white">{period}</div>
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={refreshing}
          title="Rates refresh karein"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 transition hover:border-red-600 hover:text-red-400 active:scale-95 disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
