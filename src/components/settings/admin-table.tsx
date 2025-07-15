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
import { useGetAdmins } from "@/api-hooks/admins/get-admins";
import { AdminProps } from "@/lib/types/types";
import EditAdmin from "@/components/dialog/admin/edit-admin";
import CreateAdmin from "../dialog/admin/create-admin";
import DeleteAdmin from "../dialog/admin/delete-admin";
import { User } from "lucide-react";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "EMAIL", uid: "email" },
  { name: "ACTIONS", uid: "actions" },
];

export default function AdminTable() {
  const { data: admins } = useGetAdmins();

  const renderCell = React.useCallback(
    (admin: AdminProps, columnKey: React.Key) => {
      const cellValue = admin[columnKey as keyof AdminProps];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/" alt={admin.name} />
                <AvatarFallback>
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{cellValue}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>
          );
        case "role":
          return <p className="text-bold text-sm capitalize">{cellValue}</p>;
        case "email":
          return <p className="text-bold text-sm">{cellValue}</p>;
        case "actions":
          return (
            <div className="relative flex items-center gap-4">
              <EditAdmin admin={admin} />
              <DeleteAdmin id={admin.id} />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className="my-5 rounded-2xl bg-white px-4 pt-4 shadow-md dark:bg-dark">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Admin List</h1>
        <CreateAdmin />
      </div>
      <div className="px-0">
        <Table>
          <TableHeader>
            {columns.map((column: any) => (
              <TableHead
                key={column.uid}
                className={column.uid === "actions" ? "text-center" : "text-left"}
              >
                {column.name}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {admins?.admins?.map((item: any) => (
              <TableRow key={item.id}>
                {columns.map((column: any) => (
                  <TableCell key={column.uid}>
                    {renderCell(item, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
