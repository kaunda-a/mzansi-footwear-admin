"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  ChipProps,
  Button,
  SelectItem,
  Select,
} from "@nextui-org/react";
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

const statusColorMap: Record<string, ChipProps["color"]> = {
  delivered: "success",
  pending: "danger",
  ongoing: "warning",
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
          <Chip
            className="capitalize"
            color={statusColorMap[order.status]}
            size="sm"
            variant="flat"
          >
            {order.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="View order details">
              <Button
                as={Link}
                href={`/dashboard/orders/${order.id}`}
                isIconOnly
                size="sm"
                variant="light"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>
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
      <Table
        aria-label="Recent Orders table"
        classNames={{
          wrapper: "px-0 shadow-none",
        }}
      >
        <TableHeader columns={recentOrderColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-center py-4">
              <div className="text-sm text-gray-500">
                No recent orders yet
              </div>
            </div>
          }
          items={recentOrders}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrders;
