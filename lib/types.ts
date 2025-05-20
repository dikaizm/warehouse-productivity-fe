// API Response Types
export interface OverviewCountsResponse {
  totalItemsToday: number;
  presentWorkers: number;
  productivityTarget: number;
  productivityActual: number;
}

export interface BarProductivityResponse {
  productivity: Array<{
    date: Date;
    count: number;
  }>;
  target: number;
}

export interface TrendDataPoint {
  date: Date;
  productivity: number;
  totalItems: number;
}

export interface TrendResponse {
  daily_average: number;
  weekly_average: number;
  monthly_average: number;
}

export interface RecentLogResponse {
  id: number;
  logDate: Date;
  binningCount: number;
  pickingCount: number;
  totalItems: number | null;
  issueNotes: string | null;
  totalWorkers: number;
  attendance: {
    operator: {
      id: number;
      username: string;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Top Performers Table Type
export interface TopPerformer {
  operatorName: string;
  averageMonthlyProductivity: number;
  monthlyWorkdays: number;
  achievementVsTarget: number; // percent (0-100)
} 