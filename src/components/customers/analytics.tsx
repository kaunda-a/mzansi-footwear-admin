"use client";

import NewCustomerRegistrations from "../dashboard/customer-registrations/new-customer-registrations";
import SummaryCard from "../dashboard/summary/summary-card";
import { UserCheck, UserMinus, Users } from "lucide-react";
import TopCustomers from "./tables/top-customers";
import { useDashboardStats } from "@/api-hooks/dashboard/get-dashboard-stats";
import { useCustomers } from "@/api-hooks/customers/get-customers";
import { useGuestUsers } from "@/api-hooks/customers/get-guest-users";
import { Skeleton } from "@nextui-org/react";

const Analytics = () => {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: customersData, isLoading: customersLoading } = useCustomers();
  const { data: guestUsersData, isLoading: guestLoading } = useGuestUsers();

  // Create empty customer registration data structure
  const customerRegistrationData = {
    weeklyData: [],
    monthlyData: [],
    yearlyData: [],
  };

  if (statsLoading || customersLoading || guestLoading) {
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
          bgcolor="bg-[#23B7E5]"
          color="text-[#23B7E5]"
          icon={Users}
          title="Total Customers"
          url="/dashboard/customers"
          value={statsData?.stats?.totalCustomers?.value || 0}
          percentage={statsData?.stats?.totalCustomers?.percentage || undefined}
        />
        <SummaryCard
          bgcolor="bg-danger"
          color="text-danger"
          icon={UserMinus}
          title="Guest Users"
          url="/dashboard/customers?tab=guest"
          value={guestUsersData?.guest_users?.length || 0}
          percentage={undefined}
        />
        <SummaryCard
          bgcolor="bg-[#F5B849]"
          color="text-[#F5B849]"
          icon={UserCheck}
          title="Buyers Count"
          url="/dashboard/customers?tab=analytics#top-customer"
          value={customersData?.customers?.filter(customer => customer.orders && customer.orders.length > 0).length || 0}
          percentage={undefined}
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
