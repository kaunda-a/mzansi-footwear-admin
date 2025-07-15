"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Boxes } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Analytics from "./analytics";

const ProductsTabs = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [selected, setSelected] = useState(tab || "products");

  useEffect(() => {
    setSelected(tab || "products");
  }, [tab]);

  return (
    <Tabs value={selected} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-full overflow-x-auto md:overflow-hidden">
        <TabsTrigger value="products" asChild>
          <Link href="/dashboard/products" className="flex items-center gap-2">
            <Boxes size={20} />
            <span>Products</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="stats" asChild>
          <Link href="/dashboard/products?tab=stats" className="flex items-center gap-2">
            <BarChart3 size={20} />
            <span>Stats</span>
          </Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="mt-6">
        <h1 className="my-5 text-xl text-zinc-400">All Products</h1>
        {children}
      </TabsContent>

      <TabsContent value="stats" className="mt-6">
        <Analytics />
      </TabsContent>
    </Tabs>
  );
};

export default ProductsTabs;
