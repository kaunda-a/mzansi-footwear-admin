import { Card, CardContent } from "@/components/ui/card";
import OrdersSummaryGraph from "./orders-summary-graph";

const OrdersSummary = () => {
  return (
    <Card className="mt-5 shadow-md md:mt-0">
      <CardContent className="min-h-[400px] p-6">
        <h1 className="mx-2 mt-2 text-lg font-medium">Orders Summary</h1>
        <OrdersSummaryGraph />
      </CardContent>
    </Card>
  );
};

export default OrdersSummary;
