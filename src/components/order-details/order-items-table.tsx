"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { OrderItemProps } from "@/lib/types/types";
import Image from "next/image";

const columns = [
  { name: "PRODUCT DETAILS", uid: "product-details" },
  { name: "COLOR", uid: "color" },
  { name: "PRICE", uid: "price" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "TOTAL", uid: "total" },
];

export default function OrderItemsTable({ data }: { data: OrderItemProps[] }) {
  const renderCell = React.useCallback(
    (order: OrderItemProps, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof OrderItemProps];

      switch (columnKey) {
        case "product-details":
          return (
            <div className="flex items-center gap-3">
              <Image
                src={process.env.NEXT_PUBLIC_IMAGE_URL + order.Image}
                alt={order.title}
                width={64}
                height={64}
                className="rounded object-cover"
              />
              <div>
                <p className="font-medium">{order.title}</p>
                <p className="text-sm text-gray-500">Color: {order.color}</p>
              </div>
            </div>
          );
        case "color":
          return order.color || "Null";
        case "price":
          return (
            <h1 className="font-Roboto">
              {formatCurrency(order.offerPrice / order.quantity)}
            </h1>
          );
        case "total":
          return (
            <h1 className="font-Roboto">{formatCurrency(order.offerPrice)}</h1>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className="px-0">
      <Table>
        <TableHeader>
          {columns.map((column: any) => (
            <TableHead
              key={column.uid}
              className={column.uid === "total" ? "text-right" : "text-left"}
            >
              {column.name}
            </TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              {columns.map((column: any) => (
                <TableCell
                  key={column.uid}
                  className={column.uid === "total" ? "text-right" : "text-left"}
                >
                  {renderCell(item, column.uid)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
