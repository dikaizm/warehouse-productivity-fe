// Base API Response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Response Types
export interface OverviewCountsResponse {
  totalItemsToday: number;
  presentWorkers: number;
  productivityTarget: number;
  productivityActual: number;
}

export interface BarProductivityResponse {
  productivity: Array<{
    date: Date;
    productivity: number;
  }>;
  target: number;
}

export interface TrendDataPoint {
  date: Date;
  productivity: number;
  totalItems: number;
}

export type TrendResponse = TrendDataPoint[];

export interface RecentLogResponse {
  id: number;
  logDate: Date;
  binningCount: number;
  pickingCount: number;
  totalItems: number | null;
  issueNotes: string | null;
  attendance: {
    operator: {
      id: number;
      username: string;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types (wrapping the above types with success/message)
export type ApiOverviewCountsResponse = ApiResponse<OverviewCountsResponse>;
export type ApiBarProductivityResponse = ApiResponse<BarProductivityResponse>;
export type ApiTrendResponse = ApiResponse<TrendResponse>;
export type ApiRecentLogsResponse = ApiResponse<RecentLogResponse[]>;

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: unknown;
} 