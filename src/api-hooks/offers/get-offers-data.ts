import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DealsAndOffersRes } from "@/lib/types/types";

async function fetchOffersData(): Promise<DealsAndOffersRes> {
  const { data } = await axios.get("/api/offers");
  return data;
}

export function useOffersData() {
  return useQuery({
    queryKey: ["offers-data"],
    queryFn: fetchOffersData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
