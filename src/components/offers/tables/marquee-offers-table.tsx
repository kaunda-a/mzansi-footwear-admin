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
import { MarqueeOffers } from "@prisma/client";
import DeleteMarqueeOffer from "@/components/dialog/marquee-offers/delete-offer";
import EditMarqueeOffer from "@/components/dialog/marquee-offers/edit-offers";

const columns = [
  { name: "ID", uid: "id" },
  { name: "TITLE", uid: "title" },
  { name: "URL", uid: "url" },
  { name: "ACTIONS", uid: "actions" },
];

export default function MarqueeOffersTable({
  data,
  setOffersData,
}: {
  data: MarqueeOffers[] | null;
  setOffersData: Dispatch<SetStateAction<MarqueeOffers[] | null>>;
}) {
  const renderCell = React.useCallback(
    (offer: MarqueeOffers, columnKey: React.Key) => {
      const cellValue = offer[columnKey as keyof MarqueeOffers];

      switch (columnKey) {
        case "actions":
          return (
            <div className="flex justify-end">
              <EditMarqueeOffer setOffersData={setOffersData} offer={offer} />
              <DeleteMarqueeOffer id={offer.id} setOffersData={setOffersData} />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [setOffersData],
  );

  return (
    <div className="px-0">
      <Table>
        <TableHeader>
          {columns.map((column: any) => (
            <TableHead
              key={column.uid}
              className={column.uid === "actions" ? "text-right" : "text-left"}
            >
              {column.name}
            </TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {(!data || data.length === 0) ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <div className="text-center py-8">
                  <div className="text-lg font-semibold text-gray-600 mb-2">
                    No Marquee Offers Yet
                  </div>
                  <div className="text-sm text-gray-500">
                    Create marquee offers to display scrolling promotional messages on your storefront.
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item: any) => (
              <TableRow key={item.id}>
                {columns.map((column: any) => (
                  <TableCell key={column.uid}>
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
