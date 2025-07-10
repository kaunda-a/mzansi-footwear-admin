import { formatCurrency } from "@/lib/utils";
import { Card, CardBody } from "@nextui-org/react";
import { CreditCard } from "lucide-react";

type PaymentDetailsProps = {
  id: number;
  gateway_order_id: string | null;
  gateway_payment_id: string | null;
  orderId: string;
  amount: number;
  method: string;
  via: string;
  gateway_name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const PaymentDetails = ({ data }: { data: PaymentDetailsProps }) => {
  return (
    <Card className="mt-5 rounded-sm shadow-sm">
      <CardBody className="p-0">
        <div className="flex items-center gap-3 p-3">
          <CreditCard className="text-zinc-400" size={20} />
          <h1>Payment Details</h1>
        </div>
        <hr />
        <div className="p-3">
          <ul className="my-2 space-y-1 text-sm">
            <li className="text-[#878a99]">
              Transactions:{" "}
              <span className="font-medium text-black dark:text-white">
                #{data.id}
              </span>
            </li>
            <li className="text-[#878a99]">
              Gateway Order ID:{" "}
              <span className="font-medium text-black dark:text-white">
                {data.gateway_order_id ? data.gateway_order_id : "******"}
              </span>
            </li>
            <li className="text-[#878a99]">
              Gateway Payment ID:{" "}
              <span className="font-medium text-black dark:text-white">
                {data.gateway_payment_id ? data.gateway_payment_id : "******"}
              </span>
            </li>
            <li className="text-[#878a99]">
              Payment Method:{" "}
              <span className="font-medium text-black dark:text-white">
                {data.method}
              </span>
            </li>
            <li className="text-[#878a99]">
              Via:{" "}
              <span className="font-medium text-black dark:text-white">
                {data.via}
              </span>
            </li>
            <li className="text-[#878a99]">
              Gateway:{" "}
              <span className="font-medium text-black dark:text-white">
                {data.gateway_name.toUpperCase()}
              </span>
            </li>
            <li className="text-[#878a99]">
              Status:{" "}
              <span className="font-medium text-black dark:text-white">
                {data.status.toUpperCase()}
              </span>
            </li>
            <li className="text-[#878a99]">
              Total Amount:{" "}
              <span className="font-medium text-black dark:text-white">
                {formatCurrency(data.amount)}
              </span>
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

export default PaymentDetails;
