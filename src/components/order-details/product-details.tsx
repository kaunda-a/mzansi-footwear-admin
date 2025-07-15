import { Card, CardContent } from "@/components/ui/card";
import OrderItemsTable from "./order-items-table";
import PriceDetails from "./price-details";
import { SingleOrder } from "@/lib/types/types";

const ProductDetails = ({ data }: { data: SingleOrder }) => {
  function calculateSubtotal() {
    return data.OrderItem.reduce((acc: number, curr: any) => curr.basePrice + acc, 0);
  }

  return (
    <Card className="mt-7 rounded-sm shadow-sm">
      <CardContent className="px-3 py-0">
        <OrderItemsTable data={data.OrderItem} />
        <hr />
        <PriceDetails total={data.total} subtotal={calculateSubtotal()} />
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
