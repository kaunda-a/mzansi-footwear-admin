import { Avatar, Button, Card, CardBody } from "@nextui-org/react";
import { ChevronRight, Link } from "lucide-react";

const topSources: any[] = [
  // Analytics data will be populated here when integrated with analytics service
];

const TopSources = () => {
  return (
    <Card className="shadow-md">
      <CardBody>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">Top Sources</h1>
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
        {topSources.length > 0 ? (
          <ul className="mt-4 space-y-3 ps-1">
            {topSources.map((data, i) => (
              <SourceList {...data} key={i} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 text-center py-8">
            <div className="text-sm text-gray-500">
              Traffic analytics will appear here when integrated with analytics service.
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TopSources;

function SourceList({
  source,
  progressPercentage,
  value,
}: {
  source: string;
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
        <span className="z-10 flex items-center gap-3">
          {source !== "Direct / None" ? (
            <Avatar
              src={`https://s2.googleusercontent.com/s2/favicons?domain=${source}`}
              className="h-4 w-4 bg-transparent text-tiny"
            />
          ) : (
            <Link size={16} />
          )}
          {source}
        </span>
        <span>{value}</span>
      </li>
    </>
  );
}
