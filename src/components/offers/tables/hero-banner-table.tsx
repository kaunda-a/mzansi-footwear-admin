"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeroBanner } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { capitalize, formatCurrency } from "@/lib/utils";
import AddBanner from "@/components/dialog/hero-banner/add-banner";
import EditHeroBanner from "@/components/dialog/hero-banner/edit-banner";
import DeleteHeroBanner from "@/components/dialog/hero-banner/delete-banner";

const columns = [
  { name: "ID", uid: "id" },
  { name: "IMAGES", uid: "images" },
  { name: "TITLE", uid: "title" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "BASE PRICE", uid: "basePrice" },
  { name: "OFFER PRICE", uid: "offerPrice" },
  { name: "URL", uid: "url" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "title",
  "basePrice",
  "offerPrice",
  "description",
  "images",
  "actions",
];

export default function HeroBannerTable({
  data,
  setBannerData,
}: {
  data: HeroBanner[] | null;
  setBannerData: Dispatch<SetStateAction<HeroBanner[] | null>>;
}) {
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

    return columns.filter((column) =>
      visibleColumns.has(column.uid),
    );
  }, [visibleColumns]);

  const topContent = React.useMemo(() => {
    return (
      <>
        <div className="flex items-center justify-between">
          <h1 className="font-medium md:text-lg">Hero Banners</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Columns
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 max-h-[250px] overflow-y-auto">
                {columns.map((column) => (
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
            <AddBanner setBannerData={setBannerData} />
          </div>
        </div>
        <span className="text-small text-default-400">
          Total {data?.length} banners
        </span>
      </>
    );
  }, [visibleColumns, data?.length, setBannerData]);

  const renderCell = React.useCallback(
    (banner: HeroBanner, columnKey: React.Key) => {
      const cellValue = banner[columnKey as keyof HeroBanner];

      switch (columnKey) {
        case "images":
          return (
            <Avatar className="h-10 w-10">
              <AvatarImage src={banner.imageUrlSm} alt="Banner" />
              <AvatarFallback>IMG</AvatarFallback>
            </Avatar>
          );
        case "offerPrice":
          return formatCurrency(banner.offerPrice);
        case "basePrice":
          return formatCurrency(banner.basePrice);
        case "actions":
          return (
            <div className="flex justify-end">
              <EditHeroBanner banner={banner} setBannerData={setBannerData} />
              <DeleteHeroBanner
                id={banner.id}
                setBannerData={setBannerData}
                publicId={
                  banner.imageUrl
                    ?.split(".")
                    ?.at(-2)
                    ?.split("/")
                    ?.at(-1) || "unknown"
                }
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [setBannerData],
  );

  return (
    <div className="space-y-4">
      {topContent}
      <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {headerColumns.map((column) => (
                <TableHead
                  key={column.uid}
                  className={column.uid === "actions" ? "text-right" : "text-left"}
                >
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  {headerColumns.map((column) => (
                    <TableCell key={column.uid} className={column.uid === "actions" ? "text-right" : ""}>
                      {renderCell(item, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headerColumns.length} className="text-center py-8 text-muted-foreground">
                  <div className="text-lg font-semibold mb-2">
                    No Hero Banners Yet
                  </div>
                  <div className="text-sm">
                    Create hero banners to showcase featured products and promotions on your storefront.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
