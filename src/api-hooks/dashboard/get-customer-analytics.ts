import axios from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";

type TopCustomersResponse = {
  success: boolean;
  message: string;
  topCustomers: {
    id: string;
    name: string;
    email: string;
    image: string;
    amountSpent: number;
    purchases: number;
    lastPurchase: string;
  }[];
};

type CustomerRegistrationsResponse = {
  success: boolean;
  message: string;
  registrationData: {
    name: string;
    uv: number;
    amt: number;
  }[];
  period: string;
  totalRegistrations: number;
};

async function getTopCustomersClient() {
  const { data } = await axios.get("/api/dashboard/customers?type=top");
  return data as TopCustomersResponse;
}

async function getCustomerRegistrationsClient(period: "weekly" | "monthly" | "yearly" = "weekly") {
  const { data } = await axios.get(`/api/dashboard/customers?type=registrations&period=${period}`);
  return data as CustomerRegistrationsResponse;
}

export function useTopCustomers() {
  return useQuery({
    queryKey: ["top-customers"],
    queryFn: getTopCustomersClient,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCustomerRegistrations(period: "weekly" | "monthly" | "yearly" = "weekly") {
  return useQuery({
    queryKey: ["customer-registrations", period],
    queryFn: () => getCustomerRegistrationsClient(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
