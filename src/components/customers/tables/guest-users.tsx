"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCallback } from "react";
import { useGetGuestUsers } from "@/api-hooks/guest-users/get-guest-users";
import { GuestUserProps } from "@/lib/types/types";
import DeleteGuest from "@/components/dialog/customer/delete-guest";

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  expired: "destructive",
};

const columns = [
  { name: "USER ID", uid: "user_id" },
  { name: "EXPIRATION DATE", uid: "expiration_date" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export default function GuestUsers() {
  const { data: guestUsers } = useGetGuestUsers();

  const renderCell = useCallback(
    (user: GuestUserProps, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof GuestUserProps];

      switch (columnKey) {
        case "user_id":
          return <p className="text-sm">{cellValue}</p>;
        case "expiration_date":
          return <p className="text-sm">{cellValue}</p>;
        case "status":
          return (
            <Badge
              className="capitalize"
              variant={statusColorMap[user.status]}
            >
              {cellValue}
            </Badge>
          );
        case "actions":
          return <DeleteGuest id={user.user_id} />;
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className="rounded-md border shadow-md">
      <Table>
        <TableHeader>
          {columns.map((column: any) => (
            <TableHead
              key={column.uid}
              className={column.uid === "actions" ? "text-center" : ""}
            >
              {column.name}
            </TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {(!guestUsers?.guest_users || guestUsers.guest_users.length === 0) ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <div className="text-center py-8">
                  <div className="text-lg font-semibold text-gray-600 mb-2">
                    No Guest Users Yet
                  </div>
                  <div className="text-sm text-gray-500">
                    Guest users will appear here when customers browse without creating accounts.
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            guestUsers.guest_users.map((item: any) => (
              <TableRow key={item.user_id}>
                {columns.map((column: any) => (
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
  );
}
