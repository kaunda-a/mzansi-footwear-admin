"use client";

import { useCustomerOrders } from "@/api-hooks/customers/get-order";
import { useUpdateOrderStatus } from "@/api-hooks/orders/update-status";
import { CustomerOrderProps } from "@/lib/types/types";
import { capitalize, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; 
import { Loader2 } from "lucide-react";
import { ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { motion as m } from "framer-motion";
import CustomerProfile from "../customer-profile";

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  delivered: "default",
  pending: "destructive",
  ongoing: "secondary",
};

const columns = [
  { name: "ORDER ID", uid: "oid" },
  { name: "AMOUNT", uid: "amount" },
  { name: "ADDRESS ID", uid: "addressId" },
  { name: "ORDERED DATE", uid: "date" },
  { name: "PAYMENT VERIFIED", uid: "payment" },
  { name: "STATUS", uid: "status" },
  { name: "UPDATE STATUS", uid: "update_status" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "oid",
  "amount",
  "date",
  "payment",
  "status",
  "update_status",
  "actions",
];

export default function CustomerOrder({ customerId }: { customerId: string }) {
  const { data: orders } = useCustomerOrders(customerId);

  const mutation = useUpdateOrderStatus();

  const [visibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      visibleColumns.has(column.uid),
    );
  }, [visibleColumns]);

  const renderCell = useCallback(
    (order: CustomerOrderProps, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof CustomerOrderProps];

      switch (columnKey) {
        case "oid":
          return <h1>{order.oid}</h1>;
        case "amount":
          return (
            <h1 className="font-Roboto">{formatCurrency(order.amount)}</h1>
          );
        case "addressId":
          return <h1>{order.addressId}</h1>;
        case "date":
          return <h1>{order.date}</h1>;
        case "payment":
          return (
            <h1
              className={`${
                order.payment ? "text-success" : "text-danger"
              } ms-10`}
            >
              {order.payment ? "true" : "false"}
            </h1>
          );
        case "status":
          return (
            <Badge
              className="capitalize"
              variant={statusColorMap[order.status]}
            >
              {cellValue}
            </Badge>
          );
        case "update_status":
          return (
            <Select
              defaultValue={order.status}
              onValueChange={(value: string) =>
                mutation.mutate({ id: order.oid, status: value })
              }
              disabled={mutation.isPending}
            >
              <SelectTrigger className="max-w-xs h-8 text-xs">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                {["pending", "ongoing", "delivered"].map((value) => (
                  <SelectItem key={value} value={value} className="capitalize text-xs">
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
                size="sm"
                variant="ghost"
                asChild
                className="rounded-full h-8 w-8 p-0"
              >
                <Link href={`/dashboard/orders/${order.oid}`}>
                  <Eye className="text-zinc-500" size={16} />
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

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const filteredItems = useMemo(() => {
    if (orders) {
      let filteredOrders = [...orders?.orders!];
      return filteredOrders;
    }
    return [];
  }, [orders]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {pages}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={onPreviousPage}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                size="default"
              />
            </PaginationItem>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={pageNum === page}
                    className="cursor-pointer"
                    size="default"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={onNextPage}
                className={page === pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                size="default"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }, [page, pages, onNextPage, onPreviousPage]);

  const topContent = useMemo(() => {
    return (
      <div className="mt-5 flex flex-col gap-4">
        <div className="ms-auto flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2"
              >
                Columns
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {table.getFilteredRowModel().rows.length} orders
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
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
    <>
      {orders && (
        <CustomerProfile
          customerData={{
            createdAt: orders.customer.createdAt,
            email: orders.customer.email,
            id: orders.customer.id,
            lastLogin: orders.customer.lastLogin,
            name: orders.customer.name,
            phone: orders.customer.phone,
            updatedAt: orders.customer.updatedAt,
            gender: orders.customer.gender,
            image: orders.customer.image,
          }}
        />
      )}
      <h1 className="mt-7 text-xl font-medium text-zinc-400">Orders placed</h1>
      <div className="space-y-4">
        {topContent}
        <div className="rounded-md border shadow-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
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
        {bottomContent}
      </div>
      {mutation.isPending && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed left-0 top-0 z-50 flex min-h-screen w-full items-center justify-center bg-black/30"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white dark:bg-dark">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </m.div>
      )}
    </>
  );
}
