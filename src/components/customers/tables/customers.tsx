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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, Eye, Pencil, PlusIcon, Search } from "lucide-react";
import { capitalize } from "@/lib/utils";
import { useCustomers } from "@/api-hooks/customers/get-customers";
import { Customer } from "@/lib/types/types";
import DefaultSheet from "@/components/sheets/default-sheet";
import CreateCustomerForm from "@/components/forms/create-customer";
import EditCustomerForm from "@/components/forms/edit-customer";
import DeleteCustomer from "@/components/dialog/customer/delete-customer";
import Link from "next/link";

const columns = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "GENDER", uid: "gender" },
  { name: "PHONE", uid: "phone" },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "UPDATED AT", uid: "updatedAt", sortable: true },
  { name: "LAST LOGIN", uid: "lastLogin", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "email",
  "createdAt",
  "updatedAt",
  "lastLogin",
  "actions",
];

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

export default function Customers() {
  const { data: customers } = useCustomers();

  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
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
    return columns.filter((column) =>
      visibleColumns.has(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    if (!customers?.customers || customers.customers.length === 0) return [];

    let filteredUsers = [...customers.customers];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [customers?.customers, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Customer];
      const second = b[sortDescriptor.column as keyof Customer];
      if (first && second) {
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      } else return 0;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (customer: Customer, columnKey: React.Key) => {
      const cellValue = customer[columnKey as keyof Customer];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={customer.image || ""} alt={customer.name} />
                <AvatarFallback>
                  {customer.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{cellValue}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
            </div>
          );
        case "email":
          return <p className="text-sm font-medium">{cellValue}</p>;
        case "phone":
          return <p className="text-sm font-medium">{cellValue}</p>;
        case "actions":
          return (
            <div className="flex items-center justify-center gap-1">
              {/* View customer */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => window.location.href = `/dashboard/customers/${customer.id}`}
              >
                <Eye size={16} className="text-muted-foreground" />
              </Button>

              {/* Edit customer */}
              <DefaultSheet
                title="Edit Customer"
                trigger={
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Pencil size={16} className="text-muted-foreground" />
                  </Button>
                }
                classNames={{
                  content: "min-w-[40%]",
                }}
              >
                <div className="px-5">
                  <EditCustomerForm customer={customer} />
                </div>
              </DefaultSheet>

              {/* Delete customer */}
              <DeleteCustomer id={customer.id} />
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
      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            size="sm"
            classNames={{
              inputWrapper:
                "bg-default-200 dark:bg-default-100 group-data-[focus=true]:bg-default-200 dark:group-data-[focus=true]:bg-default-100",
            }}
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="ms-auto flex items-center gap-3 md:ms-0">
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
              <DropdownMenuContent className="max-h-[250px] overflow-y-auto">
                {columns.map((column: any) => (
                  <DropdownMenuItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DefaultSheet
              title="Add Customer"
              trigger={
                <Button
                  size="sm"
                >
                  Add New
                  <PlusIcon size={20} />
                </Button>
              }
              classNames={{
                content: "min-w-[40%]",
              }}
            >
              <div className="px-5">
                <CreateCustomerForm />
              </div>
            </DefaultSheet>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {customers?.customers.length} Customers
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
    onSearchChange,
    onRowsPerPageChange,
    onClear,
    customers?.customers.length,
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
      <div className="rounded-md border shadow-md">
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
                      No Customers Yet
                    </div>
                    <div className="text-sm text-gray-500">
                      Customers will appear here once they register and create accounts.
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
