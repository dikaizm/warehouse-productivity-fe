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
  avgMonthlyProductivity: number;
  avgMonthlyWorkdays: number;
  productivity: {
    avgActual: number;
    target: number;
  };
}

export interface Role {
  id: number;
  name: string;
}

export interface SubRole {
  id: number;
  name: string;
}

export interface UserAuth {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  subRole: SubRole;
  createdAt: string;
  updatedAt: string;
}

export interface DailyLog {
  id: number;
  logDate: string;
  binningCount: number;
  pickingCount: number;
  totalItems: number;
  productivity: {
    actual: number;
    target: number;
  };
  attendance: {
    operatorId: number;
    operatorName: string;
    operatorRole: string;
    operatorSubRole: string;
  }[];
}

export interface DailyLogDetail {
  id: number;
  logDate: string;
  binningCount: number;
  pickingCount: number;
  totalItems: number;
  productivity: {
    actual: number;
    target: number;
  };
  attendance: {
    operatorId: number;
    operatorName: string;
    operatorRole: string;
    operatorSubRole: string;
  }[];
  workNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsightWorkerPresent {
  present: number;
  absent: number;
  total: number;
  presentPercentage: number;
  absentPercentage: number;
}

export interface TrendItemDataPoint {
  date: string;
  binningCount: number;
  pickingCount: number;
  totalItems: number;
}

export interface InsightTrendItem {
  data: TrendItemDataPoint[];
  period: {
    startDate: Date;
    endDate: Date;
  };
};

export type ReportType = 'daily' | 'weekly' | 'monthly';
export type ReportSortBy = 'time' | 'operatorName' | 'totalItems' | 'productivity';
export type ReportSortOrder = 'asc' | 'desc';

export interface ReportFilterParams {
  startDate: string;
  endDate: string;
  type: ReportType;
  search?: string;
  fileFormat?: 'csv' | 'pdf';
}

export interface ReportDataPoint {
  time: string; // Format depends on type: 'YYYY-MM-DD' for daily, 'YYYY-WW' for weekly, 'YYYY-MM' for monthly
  operatorId: number;
  operatorName: string;
  binningCount: number;
  pickingCount: number;
  totalItems: number;
  productivity: number;
  workdays: number;
  attendanceCount: number;
}

export interface ReportMeta {
  filter: ReportFilterParams;
  totalOperators: number;
  totalWorkdays: number;
  totalItems: number;
  generatedAt: string;
}

export interface ReportData {
  meta: ReportMeta;
  data: ReportDataPoint[];
}

export interface UserFormRequest {
  id?: number;
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  subRole: string;
}