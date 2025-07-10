"use client";

import RevenueOverview from "@/components/dashboard/revenue/revenue-overview";
import SummaryCard from "@/components/dashboard/summary/summary-card";
import TopSales from "@/components/revenue/top-sales";
import { Package, Wallet } from "lucide-react";
import { useDashboardStats } from "@/api-hooks/dashboard/get-dashboard-stats";
import { useRevenueData } from "@/api-hooks/dashboard/get-revenue-data";
import { useTopCustomers } from "@/api-hooks/dashboard/get-customer-analytics";
import { Skeleton } from "@nextui-org/react";

const RevenueClient = () => {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: topCustomersData, isLoading: customersLoading } = useTopCustomers();

  // Transform top customers data to match TopSales component format
  const topSalesData = topCustomersData?.topCustomers?.map((customer: any) => ({
    image: `https://i.pravatar.cc/150?u=${customer.id}`,
    amountSpent: customer.amountSpent || 0,
    name: customer.name,
    items: customer.totalPurchases || 0,
    lastPurchase: customer.lastPurchase || "Never",
  })) || [];

  if (statsLoading || revenueLoading || customersLoading) {
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
          bgcolor="bg-indigo-500"
          color="text-indigo-500"
          icon={Wallet}
          title="Total Revenue"
          value={statsData?.stats?.totalRevenue?.value || 0}
          isCurrency
          percentage={statsData?.stats?.totalRevenue?.percentage || undefined}
        />
        <SummaryCard
          bgcolor="bg-yellow-500"
          color="text-yellow-500"
          icon={Package}
          title="Total Sales"
          value={statsData?.stats?.totalSales?.value || 0}
          percentage={statsData?.stats?.totalSales?.percentage || undefined}
        />
        <SummaryCard
          bgcolor="bg-[#23B7E5]"
          color="text-[#23B7E5]"
          icon={Wallet}
          title="Pending Revenue"
          value={statsData?.stats?.pendingRevenue?.value || 0}
          isCurrency
          percentage={statsData?.stats?.pendingRevenue?.percentage || undefined}
        />
      </div>
      <div className="my-10 grid grid-cols-1 @3xl:grid-cols-5 md:gap-3">
        <RevenueOverview data={revenueData?.revenueData || []} />
        <TopSales data={topSalesData} />
      </div>
    </div>
  );
};

export default RevenueClient;
