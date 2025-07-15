"use client";

import NewCustomerRegistrations from "../dashboard/customer-registrations/new-customer-registrations";
import SummaryCard from "../dashboard/summary/summary-card";
import { UserCheck, UserMinus, Users } from "lucide-react";
import TopCustomers from "./tables/top-customers";
import { useDashboardStats } from "@/api-hooks/dashboard/get-dashboard-stats";

import { useGetGuestUsers } from "@/api-hooks/guest-users/get-guest-users";
import { useCustomerRegistrations } from "@/api-hooks/dashboard/get-customer-registrations";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: guestUsersData, isLoading: guestLoading } = useGetGuestUsers();

  // Fetch customer registration data for all periods
  const { data: weeklyRegistrations, isLoading: weeklyLoading } = useCustomerRegistrations("weekly");
  const { data: monthlyRegistrations, isLoading: monthlyLoading } = useCustomerRegistrations("monthly");
  const { data: yearlyRegistrations, isLoading: yearlyLoading } = useCustomerRegistrations("yearly");

  // Combine customer registration data
  const customerRegistrationData = {
    weeklyData: weeklyRegistrations?.registrationData || [],
    monthlyData: monthlyRegistrations?.registrationData || [],
    yearlyData: yearlyRegistrations?.registrationData || [],
  };

  if (statsLoading || guestLoading || weeklyLoading || monthlyLoading || yearlyLoading) {
    return (
      <div className="mt-5 space-y-5 @container">
        <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5 @container">
      <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
        <SummaryCard
          bgcolor="bg-cyan-500/10 dark:bg-cyan-400/10"
          color="text-cyan-600 dark:text-cyan-400"
          icon={Users}
          title="Total Customers"
          url="/dashboard/customers"
          value={statsData?.stats?.totalCustomers?.value || 0}
          percentage={statsData?.stats?.totalCustomers?.percentage || undefined}
        />
        <SummaryCard
          bgcolor="bg-red-500/10 dark:bg-red-400/10"
          color="text-red-500 dark:text-red-400"
          icon={UserMinus}
          title="Guest Users"
          url="/dashboard/customers?tab=guest"
          value={guestUsersData?.guest_users?.length || 0}
          percentage={undefined}
        />
        <SummaryCard
          bgcolor="bg-blue-500/10 dark:bg-blue-400/10"
          color="text-blue-600 dark:text-blue-400"
          icon={UserCheck}
          title="Buyers Count"
          url="/dashboard/customers?tab=analytics#top-customer"
          value={statsData?.stats?.totalSales?.value || 0}
          percentage={statsData?.stats?.totalSales?.percentage || undefined}
        />
      </div>
      <NewCustomerRegistrations data={customerRegistrationData} />
      <div className="pt-10" id="top-customer">
        <h1 className="text-xl font-medium text-zinc-400">Top Customers</h1>
        <TopCustomers />
      </div>
    </div>
  );
};

export default Analytics;
