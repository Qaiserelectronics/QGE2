import { useEffect, useMemo, useState } from "react";
import CardsView from "@/components/CardsView";
import FilterBar from "@/components/FilterBar";
import Header from "@/components/Header";
import ListView from "@/components/ListView";
import { BRAND } from "@/config";
import { monthIndex } from "@/lib/format";
import { loadRates } from "@/lib/loadRates";
import type { LoadResult, Rate, ViewMode } from "@/types";

const uniq = (arr: string[]) =>
  Array.from(new Set(arr.filter((x) => x && x !== "—"))).sort((a, b) => a.localeCompare(b));

export default function App() {
  const [data, setData] = useState<LoadResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [period, setPeriod] = useState("");
  const [sort, setSort] = useState("");
  const [view, setView] = useState<ViewMode>(
    () => (localStorage.getItem("qg_view") as ViewMode) || "cards",
  );

  useEffect(() => localStorage.setItem("qg_view", view), [view]);

  const fetchData = async () => {
    setLoading(true);
    const res = await loadRates();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const rates: Rate[] = data?.rates ?? [];

  const periodOf = (r: Rate) => [r.month, r.year].filter(Boolean).join(" ").trim();

  const periods = useMemo(() => {
    const list = uniq(rates.map(periodOf));
    return list.sort((a, b) => {
      const [ma, ya] = a.split(" ");
      const [mb, yb] = b.split(" ");
      if ((ya ?? "") !== (yb ?? "")) return (yb ?? "").localeCompare(ya ?? "");
      return monthIndex(mb ?? "") - monthIndex(ma ?? "");
    });
  }, [rates]);

  const latestPeriod = periods[0] ?? "";

  const companies = useMemo(() => uniq(rates.map((r) => r.company)), [rates]);

  const products = useMemo(
    () => uniq(rates.filter((r) => !company || r.company === company).map((r) => r.product)),
    [rates, company],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    let out = rates.filter((r) => {
      if (company && r.company !== company) return false;
      if (product && r.product !== product) return false;
      if (period && periodOf(r) !== period) return false;
      if (!tokens.length) return true;
      const hay = `${r.company} ${r.product} ${r.model} ${r.remarks ?? ""} ${periodOf(r)}`
        .toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });

    const by = (f: (r: Rate) => number) => (a: Rate, b: Rate) => f(a) - f(b);
    if (sort === "Cash: Low to High") out = [...out].sort(by((r) => r.cash ?? Infinity));
    else if (sort === "Cash: High to Low") out = [...out].sort(by((r) => -(r.cash ?? -Infinity)));
    else if (sort === "Company A-Z")
      out = [...out].sort(
        (a, b) => a.company.localeCompare(b.company) || a.model.localeCompare(b.model),
      );
    else if (sort === "Product A-Z")
      out = [...out].sort(
        (a, b) => a.product.localeCompare(b.product) || a.model.localeCompare(b.model),
      );
    return out;
  }, [rates, query, company, product, period, sort]);

  const reset = () => {
    setQuery("");
    setCompany("");
    setProduct("");
    setPeriod("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <Header period={latestPeriod} onRefresh={fetchData} refreshing={loading} />

      <FilterBar
        query={query}
        setQuery={setQuery}
        company={company}
        setCompany={(v) => {
          setCompany(v);
          setProduct("");
        }}
        product={product}
        setProduct={setProduct}
        period={period}
        setPeriod={setPeriod}
        sort={sort}
        setSort={setSort}
        companies={companies}
        products={products}
        periods={periods}
        view={view}
        setView={setView}
        total={rates.length}
        shown={filtered.length}
        onReset={reset}
      />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
        {data?.isDemo && !loading && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-white p-3 text-sm shadow-sm">
            <span className="mt-0.5 text-lg">⚠️</span>
            <div>
              <p className="font-bold text-red-700">Sample Rates Dikhayi Ja Rahi Hain</p>
              <p className="text-neutral-600">
                GitHub repository ke <code className="rounded bg-neutral-100 px-1">public/</code>{" "}
                folder me <code className="rounded bg-neutral-100 px-1">rates.xlsx</code> upload
                karein — website automatic nayi rates dikhana shuru kar degi.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            ["Total Items", rates.length],
            ["Companies", companies.length],
            ["Products", uniq(rates.map((r) => r.product)).length],
          ].map(([label, val]) => (
            <div
              key={String(label)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 shadow-sm"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                {label}
              </div>
              <div className="text-lg font-black text-neutral-900 sm:text-xl">
                <span className="text-red-600">{String(val)}</span>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-neutral-200 bg-white"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
            <div className="text-4xl">🔍</div>
            <p className="mt-3 text-lg font-bold text-neutral-900">Koi Result Nahi Mila</p>
            <p className="mt-1 text-sm text-neutral-500">
              Search ya filters change kar ke dobara koshish karein.
            </p>
            <button
              onClick={reset}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Filters Clear Karein
            </button>
          </div>
        ) : view === "cards" ? (
          <CardsView rates={filtered} />
        ) : (
          <ListView rates={filtered} />
        )}
      </main>

      <footer className="mt-6 border-t-4 border-red-600 bg-neutral-950 px-4 py-6 text-center text-neutral-400">
        <p className="text-sm font-extrabold uppercase tracking-widest text-white">{BRAND.name}</p>
        <p className="mt-1 text-xs">
          Salesman Rates Portal · Rates har maheenay update hoti hain · Sirf internal use ke liye
        </p>
        <p className="mt-2 text-[11px] text-neutral-600">
          © {new Date().getFullYear()} Qaiser Group Of Electronics
        </p>
      </footer>
    </div>
  );
}
