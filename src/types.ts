export type Rate = {
  id: string;
  company: string;
  product: string;
  model: string;
  cash: number | null;
  installment: number | null;
  advance?: number | null;
  monthly?: number | null;
  remarks?: string;
  month: string;
  year: string;
};

export type LoadResult = {
  rates: Rate[];
  source: string;
  isDemo: boolean;
  error?: string;
};

export type ViewMode = "cards" | "list";
