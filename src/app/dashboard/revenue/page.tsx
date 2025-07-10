import RevenueOverview from "@/components/dashboard/revenue/revenue-overview";
import SummaryCard from "@/components/dashboard/summary/summary-card";
import Nav from "@/components/nav/nav";
import TopSales from "@/components/revenue/top-sales";
import { Package, Wallet } from "lucide-react";
import RevenueClient from "./revenue-client";

const Revenue = async () => {
  return (
    <Nav>
      <h1 className="text-zinc-400 md:text-xl">Revenue</h1>
      <RevenueClient />
    </Nav>
  );
};

export default Revenue;
