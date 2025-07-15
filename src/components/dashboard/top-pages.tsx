import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const topPages: any[] = [
  // Page analytics data will be populated here when integrated with analytics service
];

const TopPages = () => {
  return (
    <Card className="mt-5 shadow-md md:mt-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">Top Pages</h1>
          {/* <Button
            variant="flat"
            size="sm"
            color="primary"
            className="dark:bg-zinc-800 dark:text-white"
            endContent={<ChevronRight size={15} />}
          >
            View All
          </Button> */}
        </div>
        {topPages.length > 0 ? (
          <ul className="mt-4 space-y-3 ps-1">
            {topPages.map((data, i) => (
              <SourceList {...data} key={i} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 text-center py-8">
            <div className="text-sm text-gray-500">
              Page analytics will appear here when integrated with analytics service.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPages;

function SourceList({
  page,
  progressPercentage,
  value,
}: {
  page: string;
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
        <span className="z-10">{page}</span>
        <span>{value}</span>
      </li>
    </>
  );
}
