import { Card, CardContent } from "@/components/ui/card";
import DeviceOriginGraph from "./device-origin-graph";

const DeviceOrigin = () => {
  return (
    <Card className="mt-5 shadow-md md:mt-0">
      <CardContent className="p-6">
        <h1 className="mx-2 mt-2 text-lg font-medium">
          Device Origin Insights
        </h1>
        <DeviceOriginGraph />
      </CardContent>
    </Card>
  );
};

export default DeviceOrigin;
