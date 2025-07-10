"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Button,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { formatCurrency, textTruncate } from "@/lib/utils";
import { useCallback } from "react";
import { ChevronRight, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import DeleteProduct from "@/components/dialog/products/delete-product";
import { useProducts } from "@/api-hooks/products/get-products";

const topSellingProductsColumns = [
  { name: "PRODUCT", uid: "title" },
  { name: "CATEGORY", uid: "category" },
  { name: "PRICE", uid: "basePrice" },
  { name: "STOCK", uid: "stock" },
  { name: "ACTIONS", uid: "actions" },
];

export default function TopSellingProducts() {
  const { data } = useProducts();

  // Get the first 5 products as "top selling" (in a real app, this would be sorted by sales)
  const topSellingProducts = data?.products?.slice(0, 5) || [];

  const renderCell = useCallback((product: any, columnKey: React.Key) => {
    const cellValue = product[columnKey as keyof typeof product];

    switch (columnKey) {
      case "title":
        return (
          <User
            avatarProps={{
              radius: "full",
              src: product.Image?.[0]?.url || "/placeholder-product.jpg",
              classNames: { img: "bg-zinc-200 dark:bg-zinc-500" },
            }}
            classNames={{
              name: "whitespace-pre",
            }}
            name={textTruncate(product.title, 17)}
          >
            {product.title}
          </User>
        );
      case "category":
        return (
          <span className="text-sm">
            {product.Category?.name || "Uncategorized"}
          </span>
        );
      case "basePrice":
        return <h1>{formatCurrency(product.basePrice)}</h1>;
      case "stock":
        return (
          <Chip
            className="capitalize"
            color={product.stock === 0 ? "danger" : "success"}
            size="sm"
            variant="flat"
          >
            {product.stock === 0
              ? "out of stock"
              : `in stock (${product.stock})`}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="View Details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                as={Link}
                radius="full"
                href={`/dashboard/products/${product.id}`}
              >
                <Eye className="text-zinc-500" />
              </Button>
            </Tooltip>
            <DeleteProduct id={product.pid} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="mx-3 rounded-2xl bg-white px-4 pt-4 shadow-md dark:bg-dark">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Top Selling Products</h1>
        <Button
          variant="flat"
          size="sm"
          as={Link}
          href="/dashboard/products"
          color="primary"
          className="dark:bg-zinc-800 dark:text-white"
          endContent={<ChevronRight size={15} />}
        >
          View All
        </Button>
      </div>
      <Table
        aria-label="Top Selling Products"
        classNames={{
          wrapper: "px-0 shadow-none",
        }}
      >
        <TableHeader columns={topSellingProductsColumns}>
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
                No products available yet
              </div>
            </div>
          }
          items={topSellingProducts}
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
}
