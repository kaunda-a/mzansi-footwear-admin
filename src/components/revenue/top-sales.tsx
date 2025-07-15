import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type TopSalesProps = {
  image: string;
  amountSpent: number;
  name: string;
  items: number;
  lastPurchase: string;
};

const TopSales = ({ data }: { data: TopSalesProps[] }) => {
  return (
    <div className="col-span-2 mt-5 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl p-3 ps-4 md:mt-0">
      <h1 className="mt-2 text-lg font-medium">Top Sales</h1>
      <p className="text-xs dark:text-zinc-400">
        Top Sales by Purchase Volume.
      </p>
      <div className="mt-4 space-y-5">
        {data.map((sale, i) => (
          <div className="flex items-center justify-between" key={i}>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={sale.image} alt={sale.name} />
                <AvatarFallback>
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{sale.name}</p>
                <p className="text-sm text-gray-500">{sale.items} items</p>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <h1 className="text-sm font-medium">
                + {formatCurrency(sale.amountSpent)}
              </h1>
              <span className="text-xs text-zinc-500 dark:text-zinc-400/80">
                Last: {sale.lastPurchase}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSales;
