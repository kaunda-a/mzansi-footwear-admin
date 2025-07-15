import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TopCustomersProps = {
  image: string;
  amountSpent: number;
  name: string;
  purchases: number;
  lastPurchase: string;
};

const TopCustomers = ({ data }: { data: TopCustomersProps[] }) => {
  return (
    <div className="col-span-2 mt-5 rounded-2xl bg-white p-3 ps-4 shadow-md dark:bg-dark md:mt-0">
      <h1 className="mt-2 text-lg font-medium">Top Customers</h1>
      <p className="text-xs dark:text-zinc-400">
        Top Customers by Purchase Volume.
      </p>
      <div className="mt-4 space-y-5">
        {data.map((sale, i) => (
          <div className="flex items-center justify-between" key={i}>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={sale.image || ""} alt={sale.name} />
                <AvatarFallback>
                  {sale.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{sale.name}</p>
                <p className="text-xs text-muted-foreground">{sale.purchases} Purchases</p>
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

export default TopCustomers;
