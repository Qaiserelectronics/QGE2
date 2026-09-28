/**
 * ============================================================
 *  QAISER GROUP OF ELECTRONICS — RATES PORTAL CONFIG
 * ============================================================
 *
 *  RATES UPDATE KARNE KA TAREEQA (sirf GitHub par):
 *
 *  1. Apni Excel file ka naam `rates.xlsx` rakhein.
 *  2. GitHub repository ke `public/` folder me file upload karein
 *     (Add file -> Upload files -> Commit changes).
 *  3. Website khud-ba-khud nayi rates dikhana shuru kar degi.
 *     (Purani file replace karne par sirf page refresh karein.)
 *
 *  EXCEL COLUMNS (pehli row me headings zaroori hain):
 *     Company | Product | Model | Cash Rate | Installment Rate | Month | Year
 *
 *  Optional extra columns (agar chahein to):
 *     Advance | Monthly | Remarks
 *
 *  Agar aap file kisi aur repo/branch me rakhna chahte hain to neeche
 *  RAW GitHub link add kar dein, misaal ke taur par:
 *     "https://raw.githubusercontent.com/USERNAME/REPO/main/public/rates.xlsx"
 * ============================================================
 */

export const BRAND = {
  name: "Qaiser Group Of Electronics",
  tagline: "Salesman Rates Portal",
  phone: "",
};

/** Jis jis jagah se file dhoondi jayegi (upar wali pehle try hogi). */
export const DATA_SOURCES: string[] = [
  "rates.xlsx",
  "./rates.xlsx",
  "data/rates.xlsx",
  "public/rates.xlsx",
  "rates.csv",
  "./rates.csv",
  // "https://raw.githubusercontent.com/USERNAME/REPO/main/public/rates.xlsx",
];
