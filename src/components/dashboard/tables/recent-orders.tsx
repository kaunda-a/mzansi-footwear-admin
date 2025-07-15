"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useCallback } from "react";
import { useOrders } from "@/api-hooks/orders/get-orders";

const recentOrderColumns = [
  { name: "ORDER ID", uid: "id" },
  { name: "AMOUNT", uid: "total" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  delivered: "default",
  pending: "destructive",
  ongoing: "secondary",
};

const RecentOrders = () => {
  const { data } = useOrders();

  // Get the 5 most recent orders
  const recentOrders = data?.orders?.slice(0, 5) || [];

  const renderCell = useCallback((order: any, columnKey: React.Key) => {
    const cellValue = order[columnKey as keyof typeof order];

    switch (columnKey) {
      case "id":
        return <h1 className="text-sm">{order.id.slice(0, 8)}...</h1>;
      case "total":
        return <h1>{formatCurrency(order.total)}</h1>;
      case "status":
        return (
          <Badge
            className="capitalize"
            variant={statusColorMap[order.status]}
          >
            {order.status}
          </Badge>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View order details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="mx-3 my-10 rounded-2xl bg-white px-4 pt-4 shadow-md dark:bg-dark">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Recent Orders</h1>
        <Button
          variant="flat"
          as={Link}
          href="/dashboard/orders"
          size="sm"
          color="primary"
          className="dark:bg-zinc-800 dark:text-white"
          endContent={<ChevronRight size={15} />}
        >
          View All
        </Button>
      </div>
      <div className="px-0">
        <Table>
          <TableHeader>
            {recentOrderColumns.map((column: any) => (
              <TableHead
                key={column.uid}
                className={column.uid === "actions" ? "text-center" : ""}
              >
                {column.name}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {(!recentOrders || recentOrders.length === 0) ? (
              <TableRow>
                <TableCell colSpan={recentOrderColumns.length} className="text-center py-4">
                  <div className="text-sm text-gray-500">
                    No recent orders yet
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((item: any) => (
                <TableRow key={item.id}>
                  {recentOrderColumns.map((column: any) => (
                    <TableCell
                      key={column.uid}
                      className={column.uid === "actions" ? "text-center" : ""}
                    >
                      {renderCell(item, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentOrders;
