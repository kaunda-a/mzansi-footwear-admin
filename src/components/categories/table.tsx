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
import { Category } from "@/lib/types/types";
import { useCategories } from "@/api-hooks/categories/get-categories";
import DeleteCategory from "../dialog/category/delete-category";
import EditCategory from "../dialog/category/edit-category";

const columns = [
  { name: "ID", uid: "id" },
  { name: "CATEGORY", uid: "name" },
  { name: "PARENT ID", uid: "parentId" },
  { name: "PRODUCTS", uid: "_count" },
  { name: "ACTIONS", uid: "actions" },
];

export default function CategoriesTable() {
  const { data: categories } = useCategories();

  const renderCell = React.useCallback(
    (category: Category, columnKey: React.Key) => {
      const cellValue = category[columnKey as keyof Category];

      switch (columnKey) {
        case "parentId":
          return cellValue === null ? "NULL" : cellValue;
        case "_count":
          return cellValue === 0 ? "" : cellValue;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <EditCategory category={category} />
              <DeleteCategory id={category.id} />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column: any) => (
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
          {categories && categories.length > 0 ? (
            categories.map((item: any) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                {columns.map((column: any) => (
                  <TableCell key={column.uid} className={column.uid === "actions" ? "text-center" : ""}>
                    {renderCell(item, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                No categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
