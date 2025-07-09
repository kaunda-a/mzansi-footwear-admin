import axios from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";

type DashboardStatsResponse = {
  success: boolean;
  message: string;
  stats: {
    pendingOrders: {
      value: number;
      percentage: null;
    };
    totalRevenue: {
      value: number;
      percentage: {
        increased: boolean;
        value: number;
      };
    };
    totalCustomers: {
      value: number;
      percentage: {
        increased: boolean;
        value: number;
      };
    };
    totalSales: {
      value: number;
      percentage: {
        increased: boolean;
        value: number;
      };
    };
  };
};

async function getDashboardStatsClient() {
  const { data } = await axios.get("/api/dashboard/stats");
  return data as DashboardStatsResponse;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
