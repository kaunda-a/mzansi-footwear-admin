import axios from "@/config/axios.config";
import { Category } from "@/lib/types/types";
import { useQuery } from "@tanstack/react-query";

async function getCategoryEndChild(): Promise<Category[]> {
  try {
    const { data } = await axios.get("/api/products/categories/end-child");
    if (data && data.categories) {
      return data.categories as Category[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export function useCategoryEndChild() {
  return useQuery({
    queryKey: ["products", "categories", "end-child"],
    queryFn: getCategoryEndChild,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
