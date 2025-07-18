import axios from "@/config/axios.config";
import { DealsAndOffersRes } from "@/lib/types/types";
import { headers } from "next/headers";

export async function getDealsAndOffers() {
  try {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    console.log("Cookie in getDealsAndOffers:", cookie);
    const { data } = await axios.get("/api/offers", {
      headers: {
        Cookie: `${cookie}`,
      },
    });

    return data as DealsAndOffersRes;
  } catch (error: any) {
    console.error("Error in getDealsAndOffers:", error);
    throw error; // Re-throw the error so it can still be caught by the page's try-catch
  }
}
