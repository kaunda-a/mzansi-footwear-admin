"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Box, Pencil, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Analytics from "./analytics";
import { Image, Product } from "@prisma/client";
import DeleteProduct from "../dialog/products/delete-product";

const ProductDetailsTabs = ({
  children,
  pid,
  product,
}: {
  children: React.ReactNode;
  pid: string;
  product: Product & { Image: Image[] };
}) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [selected, setSelected] = useState(tab || "product");

  useEffect(() => {
    setSelected(tab || "product");
  }, [tab]);

  return (
    <Tabs value={selected} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-full overflow-x-auto md:overflow-hidden">
        <TabsTrigger value="product" asChild>
          <Link href={`/dashboard/products/${pid}`} className="flex items-center gap-2">
            <Box size={20} />
            <span>Product</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="analytics" asChild>
          <Link href={`/dashboard/products/${pid}?tab=analytics`} className="flex items-center gap-2">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="product" className="mt-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="my-5 text-xl text-zinc-400">Product Details</h1>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200 text-primary hover:text-primary/80"
            >
              <Link href={`/dashboard/products/edit?pid=${pid}`}>
                <Pencil size={15} className="mr-2" />
                Edit Product
              </Link>
            </Button>
            <DeleteProduct id={pid}>
              {(onOpen) => (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpen}
                  className="bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={15} className="mr-2" />
                  Delete Product
                </Button>
              )}
            </DeleteProduct>
          </div>
        </div>
        {children}
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <Analytics product={product} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetailsTabs;
