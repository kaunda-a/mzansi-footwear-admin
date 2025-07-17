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
import { Address, SortDescriptor } from "@/lib/types/types";
import { useAddresses } from "@/api-hooks/addresses/get-addresses";
import { toast } from "sonner";
import DeleteAddress from "@/components/dialog/customer/delete-address";



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



type Selection = Set<string> | "all";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "phone",
  "address",
  "is_default",
  "is_deleted",
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
            Total {table.getFilteredRowModel().rows.length} addresses
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

  return (
    <div className="space-y-4">
      {topContent}
      <div className="rounded-md border max-h-[382px] overflow-auto">
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
  );
}
