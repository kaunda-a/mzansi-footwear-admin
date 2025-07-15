"use client";

import RevenueOverview from "@/components/dashboard/revenue/revenue-overview";
import SummaryCard from "@/components/dashboard/summary/summary-card";
import TopSales from "@/components/revenue/top-sales";
import { Package, Wallet } from "lucide-react";
import { useDashboardStats } from "@/api-hooks/dashboard/get-dashboard-stats";
import { useRevenueData } from "@/api-hooks/dashboard/get-revenue-data";
import { useTopCustomers } from "@/api-hooks/dashboard/get-customer-analytics";
import { Skeleton } from "@/components/ui/skeleton";

const RevenueClient = () => {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: weeklyData, isLoading: weeklyLoading } = useRevenueData("weekly");
  const { data: monthlyData, isLoading: monthlyLoading } = useRevenueData("monthly");
  const { data: yearlyData, isLoading: yearlyLoading } = useRevenueData("yearly");
  const { data: topCustomersData, isLoading: customersLoading } = useTopCustomers();

  // Transform top customers data to match TopSales component format
  const topSalesData = topCustomersData?.topCustomers?.map((customer: any) => ({
    image: `https://i.pravatar.cc/150?u=${customer.id}`,
    amountSpent: customer.amountSpent || 0,
    name: customer.name,
    items: customer.totalPurchases || 0,
    lastPurchase: customer.lastPurchase || "Never",
  })) || [];

  // Combine revenue data for all periods
  const combinedRevenueData = {
    weeklyData: weeklyData?.revenueData || [],
    monthlyData: monthlyData?.revenueData || [],
    yearlyData: yearlyData?.revenueData || [],
  };

  if (statsLoading || weeklyLoading || monthlyLoading || yearlyLoading || customersLoading) {
    return (
      <div className="mb-10 mt-5 @container">
        <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="my-10 grid grid-cols-1 @3xl:grid-cols-5 md:gap-3">
          <Skeleton className="col-span-3 h-64 rounded-lg" />
          <Skeleton className="col-span-2 h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 mt-5 @container">
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4">
        <SummaryCard
          bgcolor="bg-emerald-500/10 dark:bg-emerald-400/10"
          color="text-emerald-600 dark:text-emerald-400"
          icon={Wallet}
          title="Total Revenue"
          value={statsData?.stats?.totalRevenue?.value || 0}
          isCurrency
          percentage={statsData?.stats?.totalRevenue?.percentage || undefined}
        />
        <SummaryCard
          bgcolor="bg-blue-500/10 dark:bg-blue-400/10"
          color="text-blue-600 dark:text-blue-400"
          icon={Package}
          title="Total Sales"
          value={statsData?.stats?.totalSales?.value || 0}
          percentage={statsData?.stats?.totalSales?.percentage || undefined}
        />
        <SummaryCard
          bgcolor="bg-cyan-500/10 dark:bg-cyan-400/10"
          color="text-cyan-600 dark:text-cyan-400"
          icon={Wallet}
          title="Pending Revenue"
          value={statsData?.stats?.pendingRevenue?.value || 0}
          isCurrency
          percentage={statsData?.stats?.pendingRevenue?.percentage || undefined}
        />
      </div>
      <div className="my-10 grid grid-cols-1 @3xl:grid-cols-5 md:gap-3">
        <RevenueOverview data={combinedRevenueData} />
        <TopSales data={topSalesData} />
      </div>
    </div>
  );
};

export default RevenueClient;
