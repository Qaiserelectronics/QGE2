import * as XLSX from "xlsx";
import { DATA_SOURCES } from "@/config";
import type { LoadResult, Rate } from "@/types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const norm = (s: unknown) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const FIELD_MAP: Record<string, string[]> = {
  company: ["company", "companyname", "brand", "brandname", "kampani", "makers"],
  product: ["product", "productname", "item", "itemname", "category", "type"],
  model: ["model", "modelno", "modelnumber", "modelname", "code", "itemcode"],
  cash: ["cash", "cashrate", "cashprice", "cashrates", "cashrs", "cashamount", "naqad"],
  installment: [
    "installment",
    "instalment",
    "installmentrate",
    "instalmentrate",
    "installmentprice",
    "installmentrates",
    "qist",
    "qistrate",
    "creditrate",
    "credit",
  ],
  advance: ["advance", "downpayment", "advancepayment", "peshgi"],
  monthly: ["monthly", "monthlyinstallment", "permonth", "monthlyqist", "emi"],
  remarks: ["remarks", "remark", "note", "notes", "detail", "details"],
  month: ["month", "mah", "maheena", "mahina"],
  year: ["year", "saal", "san", "sal"],
};

function detectKey(header: string): string | null {
  const h = norm(header);
  if (!h) return null;
  for (const [field, aliases] of Object.entries(FIELD_MAP)) {
    if (aliases.includes(h)) return field;
  }
  // partial match fallback
  for (const [field, aliases] of Object.entries(FIELD_MAP)) {
    if (aliases.some((a) => h.includes(a))) return field;
  }
  return null;
}

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return isFinite(v) ? v : null;
  const cleaned = String(v).replace(/[^0-9.\-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return isFinite(n) ? n : null;
}

function normalizeMonth(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number" && v >= 1 && v <= 12) return MONTHS[v - 1];
  const s = String(v).trim();
  if (!s) return "";
  const n = Number(s);
  if (!isNaN(n) && n >= 1 && n <= 12) return MONTHS[n - 1];
  const found = MONTHS.find((m) => m.toLowerCase().startsWith(s.slice(0, 3).toLowerCase()));
  return found ?? s;
}

export function parseWorkbook(wb: XLSX.WorkBook): Rate[] {
  const out: Rate[] = [];
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: true,
    });
    rows.forEach((row, i) => {
      const rec: Record<string, unknown> = {};
      for (const [rawKey, value] of Object.entries(row)) {
        const key = detectKey(rawKey);
        if (key && (rec[key] === undefined || rec[key] === "")) rec[key] = value;
      }
      const company = String(rec.company ?? "").trim();
      const product = String(rec.product ?? "").trim();
      const model = String(rec.model ?? "").trim();
      const cash = toNumber(rec.cash);
      const installment = toNumber(rec.installment);
      if (!company && !product && !model && cash === null && installment === null) return;
      out.push({
        id: `${sheetName}-${i}-${company}-${model}`,
        company: company || "—",
        product: product || "—",
        model: model || "—",
        cash,
        installment,
        advance: toNumber(rec.advance),
        monthly: toNumber(rec.monthly),
        remarks: String(rec.remarks ?? "").trim(),
        month: normalizeMonth(rec.month),
        year: String(rec.year ?? "").replace(/\.0$/, "").trim(),
      });
    });
  }
  return out;
}

async function tryFetch(url: string): Promise<Rate[] | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("text/html")) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0) return null;
    const wb = XLSX.read(buf, { type: "array" });
    const rates = parseWorkbook(wb);
    return rates.length ? rates : null;
  } catch {
    return null;
  }
}

export async function loadRates(): Promise<LoadResult> {
  const base = (import.meta as unknown as { env: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
  const candidates: string[] = [];
  for (const src of DATA_SOURCES) {
    if (/^https?:\/\//i.test(src)) candidates.push(src);
    else candidates.push(`${base}${src.replace(/^\.?\//, "")}`.replace(/\/{2,}/g, "/"), src);
  }

  for (const url of Array.from(new Set(candidates))) {
    const rates = await tryFetch(url);
    if (rates) return { rates, source: url, isDemo: false };
  }

  return {
    rates: DEMO_RATES,
    source: "demo",
    isDemo: true,
    error: "rates.xlsx nahi mili — filhaal sample data dikhaya ja raha hai.",
  };
}

/* ------------------------------------------------------------------ */
/*  Sample / demo data (sirf tab dikhta hai jab rates.xlsx na miley)   */
/* ------------------------------------------------------------------ */
const D = (
  company: string,
  product: string,
  model: string,
  cash: number,
  installment: number,
  advance: number,
  monthly: number,
): Rate => ({
  id: `${company}-${model}`,
  company,
  product,
  model,
  cash,
  installment,
  advance,
  monthly,
  remarks: "",
  month: "January",
  year: "2026",
});

export const DEMO_RATES: Rate[] = [
  D("Haier", "LED TV", "H43K66G 43\"", 62500, 79500, 15000, 5375),
  D("Haier", "Refrigerator", "HRF-336 EPB", 112000, 139000, 25000, 9500),
  D("Haier", "Air Conditioner", "HSU-18HFCF 1.5 Ton", 168000, 209000, 40000, 14084),
  D("Haier", "Washing Machine", "HWM 80-118", 54500, 68500, 12000, 4709),
  D("Dawlance", "Refrigerator", "9188 WB Avante", 134500, 168000, 30000, 11500),
  D("Dawlance", "Microwave Oven", "DW-115 CHZP", 31500, 39500, 8000, 2625),
  D("Dawlance", "Air Conditioner", "Elegance 30 Inverter", 176000, 219000, 45000, 14500),
  D("PEL", "Refrigerator", "PRLP-21850 Life Pro", 118000, 146500, 28000, 9875),
  D("PEL", "Deep Freezer", "PDF-145 Inverter", 89500, 112000, 20000, 7667),
  D("PEL", "LED TV", "PEL 55 Smart UHD", 98000, 122000, 25000, 8084),
  D("Orient", "Air Cooler", "OR-9000 Air Cooler", 36500, 45500, 9000, 3042),
  D("Orient", "Washing Machine", "OWM-1250 Twin Tub", 42500, 53500, 10000, 3625),
  D("Gree", "Air Conditioner", "GS-18PITH11W Pular", 189000, 236000, 50000, 15500),
  D("Gree", "Air Conditioner", "GS-12FITH1C Fairy", 148000, 184000, 38000, 12167),
  D("Samsung", "LED TV", "UA55CU7000 55\" 4K", 139000, 172000, 35000, 11417),
  D("Samsung", "LED TV", "UA43T5300 43\" Smart", 79500, 99500, 20000, 6625),
  D("Super Asia", "Washing Machine", "SA-280 Crystal Wash", 24500, 31000, 6000, 2084),
  D("Super Asia", "Water Dispenser", "HC-32 Hot & Cold", 38500, 48000, 10000, 3167),
  D("Kenwood", "Air Conditioner", "KES-1857S eSpectra", 182000, 226000, 46000, 15000),
  D("Kenwood", "Microwave Oven", "KMW-25 Grill", 34500, 43000, 9000, 2834),
];
