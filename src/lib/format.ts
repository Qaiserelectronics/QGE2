export const fmt = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : "Rs " + Math.round(n).toLocaleString("en-PK");

export const fmtShort = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : Math.round(n).toLocaleString("en-PK");

export const MONTH_ORDER = [
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

export function monthIndex(m: string) {
  const i = MONTH_ORDER.findIndex((x) => x.toLowerCase() === m.trim().toLowerCase());
  return i === -1 ? 99 : i;
}
