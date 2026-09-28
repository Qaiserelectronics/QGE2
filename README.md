# Qaiser Group Of Electronics — Salesman Rates Portal

Salesman ke liye monthly rate list website (Red / White / Black theme, mobile friendly).

## Rates Kaise Update Karein (GitHub se)

1. Apni monthly rate list Excel me banayein aur file ka naam **`rates.xlsx`** rakhein.
2. GitHub repository kholein → folder **`public/`** → **Add file → Upload files**.
3. `rates.xlsx` upload kar ke **Commit changes** dabayein (purani file replace ho jayegi).
4. Website par page refresh karein (ya header ka 🔄 button dabayein) — nayi rates aa jayengi.

> Website par Excel upload ka koi option nahi hai (jaisa ke chaha gaya tha).
> Rates sirf GitHub repository se update hoti hain.

## Excel Columns (pehli row me headings)

| Company | Product | Model | Cash Rate | Installment Rate | Month | Year |
|---------|---------|-------|-----------|------------------|-------|------|
| Haier   | LED TV  | H43K66G | 62500   | 79500            | January | 2026 |

Optional columns (agar chahein): **Advance**, **Monthly**, **Remarks**

Column ke naam thoray different hon (jaise `Brand`, `Qist Rate`, `Cash Price`) to bhi app khud pehchan leta hai.
Ek hi file me multiple sheets bhi chalti hain.

## Features

- 🔍 Search bar (Company / Product / Model — multi-word search)
- ⬇️ Dropdown filters: Company, Product, Month-Year, Sort
- 🔁 View As: **Cards** aur **List**
- 📱 Mobile friendly (har screen size)
- 🎨 Red / White / Black professional theme

## Local Development

```bash
npm install
npm run dev     # development
npm run build   # production build -> dist/
```

`dist/index.html` ko GitHub Pages par host kar dein aur `rates.xlsx` usi folder me rakhein.
