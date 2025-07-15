"use client";

import SummaryCard from "@/components/dashboard/summary/summary-card";
import RevenueOverview from "@/components/dashboard/revenue/revenue-overview";
import TopCustomers from "@/components/dashboard/top-customers";
import RecentOrders from "@/components/dashboard/tables/recent-orders";
import TopSellingProducts from "@/components/dashboard/tables/top-selling-products";
import TopStateBySales from "@/components/dashboard/top-state-by-sales";
import RecentActivities from "@/components/dashboard/recent-activities";
import NewCustomerRegistrations from "@/components/dashboard/customer-registrations/new-customer-registrations";
import TopSources from "@/components/dashboard/top-sources";
import TopPages from "@/components/dashboard/top-pages";
import DeviceOrigin from "@/components/dashboard/device-origin/device-origin";
import VisitDetails from "@/components/dashboard/visit-details/visit-details";
import { useDashboardStats } from "@/api-hooks/dashboard/get-dashboard-stats";
import { useRevenueData } from "@/api-hooks/dashboard/get-revenue-data";
import { useTopCustomers, useCustomerRegistrations } from "@/api-hooks/dashboard/get-customer-analytics";
import { CalendarClock, Package, Users, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/error-boundary/error-boundary";
import ApiErrorBoundary from "@/components/error-boundary/api-error-boundary";

export default function DashboardClient() {
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading, error: revenueError, refetch: refetchRevenue } = useRevenueData("weekly");
  const { data: topCustomersData, isLoading: customersLoading, error: customersError, refetch: refetchCustomers } = useTopCustomers();
  const { data: registrationsData, isLoading: registrationsLoading, error: registrationsError, refetch: refetchRegistrations } = useCustomerRegistrations("weekly");

  // Create card details from real data
  const cardDetails = statsData ? [
    {
      icon: CalendarClock,
      title: "Orders Pending",
      url: "/dashboard/orders",
      color: "text-red-500 dark:text-red-400",
      bgcolor: "bg-red-500/10 dark:bg-red-400/10",
      value: statsData.stats.pendingOrders.value,
      percentage: statsData.stats.pendingOrders.percentage || undefined,
    },
    {
      icon: Wallet,
      title: "Total Revenue",
      url: "/dashboard/revenue",
      color: "text-emerald-600 dark:text-emerald-400",
      bgcolor: "bg-emerald-500/10 dark:bg-emerald-400/10",
      value: statsData.stats.totalRevenue.value,
      percentage: statsData.stats.totalRevenue.percentage || undefined,
      isCurrency: true,
    },
    {
      icon: Users,
      title: "Total Customers",
      url: "/dashboard/customers",
      color: "text-cyan-600 dark:text-cyan-400",
      bgcolor: "bg-cyan-500/10 dark:bg-cyan-400/10",
      value: statsData.stats.totalCustomers.value,
      percentage: statsData.stats.totalCustomers.percentage || undefined,
    },
    {
      icon: Package,
      title: "Total Sales",
      url: "/dashboard/revenue",
      color: "text-blue-600 dark:text-blue-400",
      bgcolor: "bg-blue-500/10 dark:bg-blue-400/10",
      value: statsData.stats.totalSales.value,
      percentage: statsData.stats.totalSales.percentage || undefined,
    },
  ] : [];

  // Transform revenue data for the chart component
  const transformedRevenueData = revenueData ? {
    weeklyData: revenueData.revenueData,
    monthlyData: [], // Will be populated when monthly is selected
    yearlyData: [], // Will be populated when yearly is selected
  } : null;

  // Transform customer registrations data
  const transformedRegistrationsData = registrationsData ? {
    weeklyData: registrationsData.registrationData,
    monthlyData: [], // Will be populated when monthly is selected
    yearlyData: [], // Will be populated when yearly is selected
  } : null;

  return (
    <div className="@container">
      {/* Summary Cards */}
      <ErrorBoundary>
        <ApiErrorBoundary
          error={statsError}
          isLoading={statsLoading}
          onRetry={refetchStats}
          fallbackMessage="Failed to load dashboard statistics"
        >
          <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-4">
            {statsLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-white p-4 dark:bg-dark">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              cardDetails.map((cardDetail, i) => (
                <SummaryCard {...cardDetail} key={i} />
              ))
            )}
          </div>
        </ApiErrorBoundary>
      </ErrorBoundary>

      <VisitDetails />

      {/* Revenue and Top Customers */}
      <div className="my-10 grid grid-cols-1 px-3 @3xl:grid-cols-5 md:gap-3">
        {revenueLoading ? (
          <div className="@3xl:col-span-3">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        ) : transformedRevenueData ? (
          <RevenueOverview data={transformedRevenueData} />
        ) : (
          <div className="@3xl:col-span-3 flex h-80 items-center justify-center rounded-lg border bg-white dark:bg-dark">
            <p className="text-muted-foreground">No revenue data available</p>
          </div>
        )}

        {customersLoading ? (
          <div className="@3xl:col-span-2">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        ) : topCustomersData ? (
          <TopCustomers data={topCustomersData.topCustomers} />
        ) : (
          <div className="@3xl:col-span-2 flex h-80 items-center justify-center rounded-lg border bg-white dark:bg-dark">
            <p className="text-muted-foreground">No customer data available</p>
          </div>
        )}
      </div>

      <RecentOrders />
      <TopSellingProducts />

      {/* Customer Registrations and Device Origin */}
      <div className="my-10 grid grid-cols-1 px-3 @3xl:grid-cols-3 md:gap-3">
        {registrationsLoading ? (
          <Skeleton className="h-80 w-full rounded-lg" />
        ) : transformedRegistrationsData ? (
          <NewCustomerRegistrations data={transformedRegistrationsData} />
        ) : (
          <div className="flex h-80 items-center justify-center rounded-lg border bg-white dark:bg-dark">
            <p className="text-muted-foreground">No registration data available</p>
          </div>
        )}
        <DeviceOrigin />
      </div>

      {/* Additional Analytics */}
      <div className="my-10 grid grid-cols-1 px-3 @3xl:grid-cols-2 md:gap-3">
        <TopSources />
        <TopPages />
      </div>
      <div className="my-10 grid grid-cols-1 px-3 @3xl:grid-cols-2 md:gap-3">
        <TopStateBySales />
        <RecentActivities />
      </div>
    </div>
  );
}
