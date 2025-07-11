import axios from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";

type CustomerRegistrationResponse = {
  success: boolean;
  message: string;
  registrationData: {
    name: string;
    uv: number;
  }[];
  period: string;
  totalRegistrations: number;
};

async function getCustomerRegistrationsClient(period: "weekly" | "monthly" | "yearly" = "weekly") {
  const { data } = await axios.get(`/api/dashboard/customer-registrations?period=${period}`);
  return data as CustomerRegistrationResponse;
}

export function useCustomerRegistrations(period: "weekly" | "monthly" | "yearly" = "weekly") {
  return useQuery({
    queryKey: ["customer-registrations", period],
    queryFn: () => getCustomerRegistrationsClient(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
