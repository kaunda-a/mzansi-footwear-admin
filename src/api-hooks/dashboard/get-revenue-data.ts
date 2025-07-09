import axios from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";

type RevenueDataResponse = {
  success: boolean;
  message: string;
  revenueData: {
    name: string;
    total: number;
  }[];
  period: string;
  totalRevenue: number;
  orderCount: number;
};

async function getRevenueDataClient(period: "weekly" | "monthly" | "yearly" = "weekly") {
  const { data } = await axios.get(`/api/dashboard/revenue?period=${period}`);
  return data as RevenueDataResponse;
}

export function useRevenueData(period: "weekly" | "monthly" | "yearly" = "weekly") {
  return useQuery({
    queryKey: ["revenue-data", period],
    queryFn: () => getRevenueDataClient(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
