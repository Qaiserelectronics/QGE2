import { fmt } from "@/lib/format";
import type { Rate } from "@/types";

export default function CardsView({ rates }: { rates: Rate[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rates.map((r) => (
        <article
          key={r.id}
          className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-xl hover:shadow-red-100"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-neutral-900" />
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                {r.company}
              </span>
              {(r.month || r.year) && (
                <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700 ring-1 ring-red-200">
                  {r.month} {r.year}
                </span>
              )}
            </div>

            <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
              {r.product}
            </p>
            <h3 className="mt-0.5 text-[17px] font-extrabold leading-snug text-neutral-900">
              {r.model}
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Cash Rate
                </div>
                <div className="mt-0.5 text-[15px] font-black text-neutral-900">{fmt(r.cash)}</div>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                  Installment
                </div>
                <div className="mt-0.5 text-[15px] font-black text-red-700">
                  {fmt(r.installment)}
                </div>
              </div>
            </div>

            {(r.advance || r.monthly) && (
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                {!!r.advance && (
                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-neutral-700">
                    Advance: {fmt(r.advance)}
                  </span>
                )}
                {!!r.monthly && (
                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-neutral-700">
                    Monthly: {fmt(r.monthly)}
                  </span>
                )}
              </div>
            )}

            {r.remarks && (
              <p className="mt-2 line-clamp-2 text-[11px] italic text-neutral-500">{r.remarks}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
