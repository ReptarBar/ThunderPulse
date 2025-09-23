export type WindowKey = "7" | "14" | "30" | "60" | "90" | "180" | "365" | "all";

export interface SourceWindow {
  total: number;
}

export interface MonthBucket {
  key: string;     // e.g. "2025-01"
  label: string;   // e.g. "Jan 2025"
  total: number;
}

export interface SourceResult {
  source: string;
  windows: Record<WindowKey | string, SourceWindow>;
  months?: MonthBucket[]; // last 12 full calendar months
  roster?: string[];
}
