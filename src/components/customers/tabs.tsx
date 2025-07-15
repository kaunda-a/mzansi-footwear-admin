"use client";

import { Tabs as ShadcnTabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, UserMinus, Users } from "lucide-react";
import Analytics from "./analytics";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Tabs = ({ children }: { children: React.ReactNode[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");
  const [selected, setSelected] = useState(tab || "customers");

  useEffect(() => {
    setSelected(tab || "customers");
  }, [tab]);

  const handleTabChange = (value: string) => {
    setSelected(value);
    if (value === "customers") {
      router.push("/dashboard/customers");
    } else {
      router.push(`/dashboard/customers?tab=${value}`);
    }
  };

  return (
    <ShadcnTabs
      value={selected}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 max-w-full overflow-x-auto md:overflow-hidden">
        <TabsTrigger value="customers" className="flex items-center gap-2">
          <Users size={16} />
          <span>Customers</span>
        </TabsTrigger>
        <TabsTrigger value="guest" className="flex items-center gap-2">
          <UserMinus size={16} />
          <span>Guest Users</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 size={16} />
          <span>Analytics</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="customers" className="mt-6">
        <h1 className="mb-5 text-xl text-zinc-400">All Customers</h1>
        {children[0]}
      </TabsContent>

      <TabsContent value="guest" className="mt-6">
        <h1 className="mb-5 text-xl text-zinc-400">All Guest Users</h1>
        {children[1]}
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <Analytics />
      </TabsContent>
    </ShadcnTabs>
  );
};

export default Tabs;
