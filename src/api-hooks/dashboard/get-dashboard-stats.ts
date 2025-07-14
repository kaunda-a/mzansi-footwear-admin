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
    pendingRevenue: {
      value: number;
      percentage: null;
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

async function getDashboardStatsClient(): Promise<DashboardStatsResponse> {
  try {
    const { data } = await axios.get("/api/dashboard/stats");
    return data as DashboardStatsResponse;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
