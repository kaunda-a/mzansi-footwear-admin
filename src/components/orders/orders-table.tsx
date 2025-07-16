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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Eye, Search } from "lucide-react";
import { capitalize, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { OrderProps } from "@/lib/types/types";
import { useUpdateOrderStatus } from "@/api-hooks/orders/update-status";

const statusColorMap: Record<string, "success" | "danger" | "warning" | "default"> = {
  delivered: "success",
  pending: "danger",
  ongoing: "warning",
};

const columns = [
  { name: "ORDER ID", uid: "id" },
  { name: "USER ID", uid: "userId" },
  { name: "AMOUNT", uid: "total", sortable: true },
  { name: "ORDERED DATE", uid: "orderDate", sortable: true },
  { name: "PAYMENT VERIFIED", uid: "payment_verified", sortable: true },
  { name: "STATUS", uid: "status" },
  { name: "ITEMS COUNT", uid: "itemsCount" },
  { name: "ADDRESS ID", uid: "addressId" },
  { name: "UPDATE STATUS", uid: "update_status" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "total",
  "orderDate",
  "payment_verified",
  "status",
  "itemsCount",
  "update_status",
  "actions",
];

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export default function OrdersTable({ orders }: { orders?: OrderProps[] }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "total",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const mutation = useUpdateOrderStatus(); // Update order mutation

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

    return columns.filter((column) =>
      visibleColumns.has(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];

    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.id.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredOrders;
  }, [orders, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems?.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems?.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];

    return [...items].sort((a: OrderProps, b: OrderProps) => {
      const first = a[sortDescriptor.column as keyof OrderProps] as number;
      const second = b[sortDescriptor.column as keyof OrderProps] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (order: OrderProps, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof OrderProps];

      switch (columnKey) {
        case "total":
          return formatCurrency(order.total);
        case "payment_verified":
          return (
            <h1
              className={`${
                order.payment_verified ? "text-success" : "text-danger"
              } ms-10`}
            >
              {order.payment_verified ? "true" : "false"}
            </h1>
          );
        case "status":
          return (
            <Badge
              className="capitalize"
              variant={statusColorMap[order.status] || "default"}
            >
              {cellValue}
            </Badge>
          );
        case "itemsCount":
          return <h1 className="text-center">{cellValue}</h1>;
        case "update_status":
          return (
            <Select
              onValueChange={(value: string) =>
                mutation.mutate({ id: order.id, status: value })
              }
              defaultValue={order.status}
              disabled={mutation.isPending}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                {["pending", "ongoing", "delivered"].map((value: string) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="capitalize text-xs"
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center">
              {/* View order */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-8 p-0 rounded-full"
              >
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Eye size={16} className="text-muted-foreground" />
                </Link>
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [mutation],
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
              placeholder="Search by order id..."
              value={filterValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
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
                {columns.map((column: any) => (
                  <DropdownMenuItem
                    key={column.uid}
                    className="capitalize"
                    onClick={() => {
                      const newVisibleColumns = new Set(visibleColumns);
                      if (newVisibleColumns.has(column.uid)) {
                        newVisibleColumns.delete(column.uid);
                      } else {
                        newVisibleColumns.add(column.uid);
                      }
                      setVisibleColumns(newVisibleColumns);
                    }}
                  >
                    {capitalize(column.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {orders?.length || 0} orders
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    orders?.length,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  onPreviousPage();
                }}
                className={pages === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setPage(pageNum);
                  }}
                  isActive={pageNum === page}
                  size="default"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  onNextPage();
                }}
                className={pages === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }, [page, pages, onNextPage, onPreviousPage]);

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
            {sortedItems && sortedItems.length > 0 ? (
              sortedItems.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  {headerColumns.map((column: any) => (
                    <TableCell key={column.uid} className={column.uid === "actions" ? "text-center" : ""}>
                      {renderCell(item, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headerColumns.length} className="text-center py-8 text-muted-foreground">
                  <div className="text-lg font-semibold mb-2">
                    No Orders Yet
                  </div>
                  <div className="text-sm">
                    Orders will appear here once customers start making purchases.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {bottomContent}
    </div>
  );
}
