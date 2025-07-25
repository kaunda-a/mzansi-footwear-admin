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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { capitalize, formatCurrency, textTruncate } from "@/lib/utils";
import { useProducts } from "@/api-hooks/products/get-products";
import { ProductProps } from "@/lib/types/types";
import Link from "next/link";
import Image from "next/image";
import DeleteProduct from "../dialog/products/delete-product";

const columns = [
  { name: "ID", uid: "id" },
  { name: "SLUG", uid: "slug" },
  { name: "TITLE", uid: "title", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
  { name: "SHORT DESC", uid: "shortDescription" },
  { name: "BASE PRICE", uid: "basePrice", sortable: true },
  { name: "OFFER PRICE", uid: "offerPrice", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "STOCK", uid: "stock", sortable: true },
  { name: "UNIT SOLD", uid: "purchases", sortable: true },
  { name: "EARNINGS", uid: "earnings", sortable: true },
  { name: "COLOR", uid: "color" },
  { name: "VARIANT NAME", uid: "variantName" },
  { name: "VARIANT VALUES", uid: "variantValues" },
  { name: "KEYWORDS", uid: "keywords" },
  { name: "CREATED AT", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];



type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export default function ProductsTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "offerPrice",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const { data } = useProducts();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

    return columns.filter((column) =>
      visibleColumns.has(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    if (!data?.products || data.products.length === 0) return [];

    let filteredProducts = [...data.products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredProducts;
  }, [data?.products, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ProductProps, b: ProductProps) => {
      const first = a[sortDescriptor.column as keyof ProductProps] as number;
      const second = b[sortDescriptor.column as keyof ProductProps] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (product: ProductProps, columnKey: React.Key) => {
      const cellValue = product[columnKey as keyof ProductProps];

      switch (columnKey) {
        case "title":
          return (
            <div className="flex items-center gap-3">
              <Image
                src={process.env.NEXT_PUBLIC_IMAGE_URL + product.image}
                alt={product.title}
                width={40}
                height={40}
                className="rounded-full bg-zinc-200 dark:bg-zinc-500 object-cover"
              />
              <div>
                <p className="font-medium whitespace-pre">
                  {textTruncate(product.title, 17)}
                </p>
              </div>
            </div>
          );
        case "offerPrice":
          return formatCurrency(product.offerPrice);
        case "basePrice":
          return formatCurrency(product.basePrice);
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
        case "earnings":
          return (
            <h1 className="font-medium text-green-600 dark:text-green-400">
              {formatCurrency(product.earnings)}
            </h1>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center gap-1">
              {/* View product */}
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

              {/* Edit product */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-8 p-0 rounded-full"
              >
                <Link href={`/dashboard/products/edit?pid=${product.id}`}>
                  <Pencil size={16} className="text-muted-foreground" />
                </Link>
              </Button>

              {/* Delete product */}
              <DeleteProduct id={product.id}>
                {(onOpen) => (
                  <Button
                    onClick={onOpen}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full text-red-600 hover:text-red-700 bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </DeleteProduct>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-[44%]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={table.getColumn("title")?.getFilterValue() as string ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden sm:flex">
                  Columns
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuItem key={column.id} className="capitalize">
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          className="mr-2"
                        />
                        {column.id}
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild>
              <Link href="/dashboard/products/add">
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Total {table.getFilteredRowModel().rows.length} products
          </span>
          <label className="flex items-center text-sm text-muted-foreground gap-2">
            Rows per page:
            <select
              className="bg-background border border-input rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
              onChange={(event) => {
                table.setPageSize(Number(event.target.value));
              }}
              defaultValue={table.getState().pagination.pageSize}
            >
              {[5, 10, 15].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }, []);

  

  return (
    <div className="space-y-4">
      {topContent}
      <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {headerColumns.map((column: any) => (
                <TableHead
                  key={column.uid}
                  className={`${column.uid === "actions" ? "text-center" : "text-left"} ${
                    column.sortable ? "cursor-pointer hover:bg-muted/50" : ""
                  }`}
                  onClick={() => {
                    if (column.sortable) {
                      setSortDescriptor({
                        column: column.uid,
                        direction:
                          sortDescriptor.column === column.uid &&
                          sortDescriptor.direction === "ascending"
                            ? "descending"
                            : "ascending",
                      });
                    }
                  }}
                >
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
