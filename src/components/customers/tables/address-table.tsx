"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, Trash2 } from "lucide-react";
import { capitalize, textTruncate } from "@/lib/utils";
import { Address } from "@/lib/types/types";
import { useAddresses } from "@/api-hooks/addresses/get-addresses";
import { toast } from "sonner";
import DeleteAddress from "@/components/dialog/customer/delete-address";

// Type definitions for shadcn/ui compatibility
type Selection = Set<string> | "all";
type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

const columns = [
  { name: "ID", uid: "id" },
  { name: "USER ID", uid: "user_id" },
  { name: "NAME", uid: "name", sortable: true },
  { name: "PHONE", uid: "phone" },
  { name: "ADDRESS", uid: "address" },
  { name: "DISTRICT", uid: "district" },
  { name: "STATE", uid: "state" },
  { name: "PINCODE", uid: "pincode" },
  { name: "LAND MARK", uid: "land_mark" },
  { name: "LOCALITY", uid: "locality" },
  { name: "ALT PHONE", uid: "alt_phone" },
  { name: "IS DEFAULT", uid: "is_default" },
  { name: "IS DELETED", uid: "is_deleted", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "user_id",
  "is_deleted",
  "address",
  "district",
  "state",
  "actions",
];

export default function AddressTable() {
  const { data: addressData } = useAddresses();

  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    if (!addressData?.addresses || addressData.addresses.length === 0) return [];

    let filteredAddresses = [...addressData.addresses];

    if (hasSearchFilter) {
      filteredAddresses = filteredAddresses.filter((address) =>
        address.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredAddresses;
  }, [addressData?.addresses, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];

    return [...items].sort((a: Address, b: Address) => {
      const first = a[sortDescriptor.column as keyof Address] as number;
      const second = b[sortDescriptor.column as keyof Address] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (address: Address, columnKey: React.Key) => {
      const cellValue = address[columnKey as keyof Address];

      switch (columnKey) {
        case "user_id":
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="cursor-pointer hover:text-primary"
                    onClick={() => {
                      navigator.clipboard.writeText(address.user_id);
                      toast.success("User ID copied to clipboard");
                    }}
                  >
                    {textTruncate(address.user_id, 10)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy UID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        case "is_default":
          return <p>{cellValue?.toString()}</p>;
        case "is_deleted":
          return (
            <p className={`${cellValue ? "text-danger" : "text-success"}`}>
              {cellValue?.toString()}
            </p>
          );
        case "actions":
          return (
            <DeleteAddress id={address.id}>
              {(onOpen) => (
                <Button
                  onClick={onOpen}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </DeleteAddress>
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

  // Search functionality can be added here if needed

  const topContent = React.useMemo(() => {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-end justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                Columns
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
              {columns.map((column: any) => (
                <DropdownMenuItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {addressData?.addresses.length} addresses
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
    onRowsPerPageChange,
    addressData?.addresses.length,
  ]);

  const bottomContent = React.useMemo(() => {
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
            {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => setPage(pageNum)}
                  isActive={pageNum === page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
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
  }, [page, pages, onNextPage, onPreviousPage, setPage]);

  return (
    <div className="space-y-4">
      {topContent}
      <div className="rounded-md border max-h-[382px] overflow-auto">
        <Table>
          <TableHeader>
            {headerColumns.map((column: any) => (
              <TableHead
                key={column.uid}
                className={column.uid === "actions" ? "text-center" : ""}
              >
                {column.name}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerColumns.length} className="text-center py-8">
                  <div className="text-center py-8">
                    <div className="text-lg font-semibold text-gray-600 mb-2">
                      No Customer Addresses Yet
                    </div>
                    <div className="text-sm text-gray-500">
                      Customer addresses will appear here when customers add shipping addresses to their accounts.
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((item: any) => (
                <TableRow key={item.id}>
                  {headerColumns.map((column: any) => (
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
      {bottomContent}
    </div>
  );
}
