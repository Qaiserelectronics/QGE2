import type { ViewMode } from "@/types";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  product: string;
  setProduct: (v: string) => void;
  period: string;
  setPeriod: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  companies: string[];
  products: string[];
  periods: string[];
  view: ViewMode;
  setView: (v: ViewMode) => void;
  total: number;
  shown: number;
  onReset: () => void;
};

function Select({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <label className="relative block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-900 py-2.5 pl-3 pr-8 text-sm font-medium text-white outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="pointer-events-none absolute bottom-3 right-2.5 h-4 w-4 text-red-500"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}

export default function FilterBar(p: Props) {
  const active = p.query || p.company || p.product || p.period;

  return (
    <div className="sticky top-[68px] z-20 border-b border-neutral-800 bg-neutral-950/95 px-3 pb-3 pt-3 backdrop-blur sm:px-6">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Search */}
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={p.query}
            onChange={(e) => p.setQuery(e.target.value)}
            placeholder="Search: Company, Product ya Model..."
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-3 pl-11 pr-10 text-[15px] text-white placeholder-neutral-500 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
          />
          {p.query && (
            <button
              onClick={() => p.setQuery("")}
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-red-700 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <Select
            label="Company"
            value={p.company}
            onChange={p.setCompany}
            options={p.companies}
            allLabel="All Companies"
          />
          <Select
            label="Product"
            value={p.product}
            onChange={p.setProduct}
            options={p.products}
            allLabel="All Products"
          />
          <Select
            label="Month / Year"
            value={p.period}
            onChange={p.setPeriod}
            options={p.periods}
            allLabel="All Months"
          />
          <Select
            label="Sort By"
            value={p.sort}
            onChange={p.setSort}
            options={["Cash: Low to High", "Cash: High to Low", "Company A-Z", "Product A-Z"]}
            allLabel="Default"
          />
        </div>

        {/* Result row + view toggle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="rounded-md bg-neutral-900 px-2 py-1 font-semibold text-white ring-1 ring-neutral-700">
              {p.shown}
            </span>
            <span>/ {p.total} items</span>
            {active && (
              <button
                onClick={p.onReset}
                className="ml-1 rounded-md border border-red-800 bg-red-950/50 px-2 py-1 font-semibold text-red-400 transition hover:bg-red-700 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-900 p-1">
            {(
              [
                ["cards", "Cards", "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"],
                ["list", "List", "M4 6h16M4 12h16M4 18h16"],
              ] as const
            ).map(([mode, label, path]) => (
              <button
                key={mode}
                onClick={() => p.setView(mode)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
                  p.view === mode
                    ? "bg-red-600 text-white shadow shadow-red-900/50"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-4 w-4"
                >
                  <path d={path} />
                </svg>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
