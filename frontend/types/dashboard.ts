// types/dashboard.ts
export interface DashboardResponse {
  totalVisitors: number;
  todaysVisitors: number;
  totalProductInterests: number;

  recentVisitors: {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  }[];

  topProducts: {
    name: string;
    count: number;
  }[];
}
