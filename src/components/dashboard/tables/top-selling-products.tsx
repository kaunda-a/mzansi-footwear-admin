"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, textTruncate } from "@/lib/utils";
import React, { useCallback } from "react";
import { ChevronRight, Eye } from "lucide-react";
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
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={product.Image?.[0]?.url || "/placeholder-product.jpg"}
                alt={product.title}
                className="bg-muted"
              />
              <AvatarFallback className="bg-muted">
                {product.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium whitespace-pre">
                {textTruncate(product.title, 17)}
              </p>
            </div>
          </div>
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
          <Badge
            className="capitalize"
            variant={product.stock === 0 ? "danger" : "success"}
          >
            {product.stock === 0
              ? "out of stock"
              : `in stock (${product.stock})`}
          </Badge>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0 rounded-full"
            >
              <Link href={`/dashboard/products/${product.id}`}>
                <Eye size={16} className="text-muted-foreground" />
              </Link>
            </Button>
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
      <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {topSellingProductsColumns.map((column: any) => (
                <TableHead
                  key={column.uid}
                  className={column.uid === "actions" ? "text-center" : "text-left"}
                >
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {topSellingProducts && topSellingProducts.length > 0 ? (
              topSellingProducts.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  {topSellingProductsColumns.map((column: any) => (
                    <TableCell key={column.uid} className={column.uid === "actions" ? "text-center" : ""}>
                      {renderCell(item, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={topSellingProductsColumns.length} className="text-center py-8 text-muted-foreground">
                  No products available yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
