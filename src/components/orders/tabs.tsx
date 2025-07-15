"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Box } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Analytics from "./analytics";

const OrdersTabs = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [selected, setSelected] = useState(tab || "orders");

  useEffect(() => {
    setSelected(tab || "orders");
  }, [tab]);

  return (
    <Tabs value={selected} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="orders" asChild>
          <Link href="/dashboard/orders" className="flex items-center gap-2">
            <Box size={16} />
            <span>Orders</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="analytics" asChild>
          <Link href="/dashboard/orders?tab=analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span>Analytics</span>
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="mt-6">
        {children}
      </TabsContent>
      <TabsContent value="analytics" className="mt-6">
        <Analytics />
      </TabsContent>
    </Tabs>
  );
};

export default OrdersTabs;
