import { useProducts } from "@/api-hooks/products/get-products";
import SummaryCard from "../dashboard/summary/summary-card";
import { ArchiveX, Boxes } from "lucide-react";

const Analytics = () => {
  const { data } = useProducts();

  return (
    <div className="mt-5 space-y-5 @container">
      <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
        <SummaryCard
          bgcolor="bg-cyan-500/10 dark:bg-cyan-400/10"
          color="text-cyan-600 dark:text-cyan-400"
          icon={Boxes}
          title="Total Products"
          value={data?.products.length || 0}
        />
        <SummaryCard
          bgcolor="bg-red-500/10 dark:bg-red-400/10"
          color="text-red-500 dark:text-red-400"
          icon={ArchiveX}
          title="Stock out products"
          value={
            data?.products.filter((product) => product.stock === 0).length || 0
          }
        />
      </div>
    </div>
  );
};

export default Analytics;
