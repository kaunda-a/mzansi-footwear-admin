import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const topStateData: any[] = [
  // Real provincial sales data will be populated here when integrated with analytics service
  // South African provinces: Western Cape, Gauteng, KwaZulu-Natal, Eastern Cape,
  // Limpopo, Mpumalanga, North West, Free State, Northern Cape
];

const TopStateBySales = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">Top Provinces By Sales</h1>
          {/* <Button
            variant="outline"
            size="sm"
            className="dark:bg-zinc-800 dark:text-white"
          >
            View All
            <ChevronRight size={15} className="ml-1" />
          </Button> */}
        </div>
        {topStateData.length > 0 ? (
          <ul className="mt-4 space-y-3 ps-1">
            {topStateData.map((data, i) => (
              <StateList {...data} key={i} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 text-center py-8">
            <div className="text-sm text-gray-500">
              Provincial sales analytics will appear here when integrated with analytics service.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopStateBySales;

function StateList({
  state,
  progressPercentage,
  value,
}: {
  state: string;
  value: string;
  progressPercentage: string | number;
}) {
  return (
    <>
      <li className="relative flex items-center justify-between rounded-md border px-3 py-2 text-sm">
        <div
          className="absolute left-0 h-full rounded-md bg-primary/30"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <span className="z-10">{state}</span>
        <span>{value}</span>
      </li>
    </>
  );
}
