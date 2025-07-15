import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

const InvoiceCard = ({ oid }: { oid: string }) => {
  return (
    <Card className="rounded-sm shadow-sm">
      <CardContent className="flex flex-row items-center justify-between p-6">
        <h1 className="font-semibold">Order #{oid}</h1>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download size={15} className="mr-2" />
          Invoice
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
