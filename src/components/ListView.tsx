import { fmt } from "@/lib/format";
import type { Rate } from "@/types";

export default function ListView({ rates }: { rates: Rate[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Desktop / tablet table */}
      <table className="hidden w-full border-collapse text-left text-sm md:table">
        <thead>
          <tr className="bg-neutral-900 text-[11px] uppercase tracking-widest text-neutral-300">
            <th className="px-4 py-3 font-bold">Company</th>
            <th className="px-4 py-3 font-bold">Product</th>
            <th className="px-4 py-3 font-bold">Model</th>
            <th className="px-4 py-3 text-right font-bold">Cash Rate</th>
            <th className="px-4 py-3 text-right font-bold text-red-400">Installment</th>
            <th className="px-4 py-3 text-center font-bold">Month / Year</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r, i) => (
            <tr
              key={r.id}
              className={`border-t border-neutral-100 transition hover:bg-red-50/60 ${
                i % 2 ? "bg-neutral-50/60" : "bg-white"
              }`}
            >
              <td className="px-4 py-3 font-bold text-neutral-900">{r.company}</td>
              <td className="px-4 py-3 text-neutral-700">{r.product}</td>
              <td className="px-4 py-3 font-semibold text-neutral-900">
                {r.model}
                {r.remarks && (
                  <span className="block text-[11px] font-normal italic text-neutral-500">
                    {r.remarks}
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-black text-neutral-900">
                {fmt(r.cash)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-black text-red-700">
                {fmt(r.installment)}
                {(!!r.advance || !!r.monthly) && (
                  <span className="block text-[11px] font-medium text-neutral-500">
                    {r.advance ? `Adv ${fmt(r.advance)}` : ""}
                    {r.advance && r.monthly ? " • " : ""}
                    {r.monthly ? `Mo ${fmt(r.monthly)}` : ""}
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold text-neutral-600">
                {r.month} {r.year}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile rows */}
      <ul className="divide-y divide-neutral-100 md:hidden">
        {rates.map((r) => (
          <li key={r.id} className="p-3 active:bg-red-50">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[10px] font-bold uppercase tracking-widest text-red-600">
                {r.company} · {r.product}
              </span>
              <span className="shrink-0 text-[10px] font-semibold text-neutral-400">
                {r.month} {r.year}
              </span>
            </div>
            <div className="mt-0.5 text-[15px] font-extrabold leading-snug text-neutral-900">
              {r.model}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-neutral-100 px-2 py-1.5">
                <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                  Cash
                </div>
                <div className="text-sm font-black text-neutral-900">{fmt(r.cash)}</div>
              </div>
              <div className="rounded-lg bg-red-50 px-2 py-1.5 ring-1 ring-red-100">
                <div className="text-[9px] font-bold uppercase tracking-wider text-red-600">
                  Installment
                </div>
                <div className="text-sm font-black text-red-700">{fmt(r.installment)}</div>
              </div>
            </div>
            {(!!r.advance || !!r.monthly) && (
              <div className="mt-1.5 text-[11px] font-semibold text-neutral-500">
                {r.advance ? `Advance ${fmt(r.advance)}` : ""}
                {r.advance && r.monthly ? "  •  " : ""}
                {r.monthly ? `Monthly ${fmt(r.monthly)}` : ""}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
