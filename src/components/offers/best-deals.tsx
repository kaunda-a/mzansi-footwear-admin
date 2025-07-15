"use client";

import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import EditDeal from "../dialog/best-deal/edit-deal";
import { BestDeal } from "@prisma/client";
import { useState } from "react";
import DeleteDeal from "../dialog/best-deal/delete-deal";
import AddNewDeal from "../dialog/best-deal/add-new-deal";
import Image from "next/image";

const BestDeals = ({ deal }: { deal: BestDeal | null }) => {
  const [dealData, setDealData] = useState(deal);

  return (
    <Card className="my-5 shadow-md @container">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-medium md:text-lg">Best Deal</h1>
          {dealData && (
            <div>
              <EditDeal data={dealData} setDealData={setDealData} />
              <DeleteDeal id={dealData.id} setDealData={setDealData} />
            </div>
          )}
        </div>
        {dealData ? (
          <div className="grid grid-cols-1 gap-3 @lg:grid-cols-3">
            <Image
              src={dealData.imageUrl}
              alt="Product image"
              width={400}
              height={225}
              className="aspect-video object-cover rounded-md"
            />
            <div className="col-span-2 space-y-2">
              <h1 className="text-sm font-medium text-zinc-400">
                Title:{" "}
                <span className="text-black dark:text-white">
                  {dealData.title}
                </span>
              </h1>
              <h1 className="text-sm font-medium text-zinc-400">
                ID:{" "}
                <span className="text-black dark:text-white">
                  {dealData.url.split("=")[1]}
                </span>
              </h1>
              <h1 className="text-sm font-medium text-zinc-400">
                Slug:{" "}
                <span className="text-black dark:text-white">
                  {dealData.url.split("?")[0].split("/").at(-1)}
                </span>
              </h1>
              <h1 className="text-sm font-medium text-zinc-400">
                Description:{" "}
                <span className="text-black dark:text-white">
                  {dealData.description}
                </span>
              </h1>
              <h1 className="text-sm font-medium text-zinc-400">
                Price:{" "}
                <span className="font-Roboto font-semibold text-black dark:text-white">
                  {formatCurrency(dealData.price)}
                </span>
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <p className="text-sm text-gray-500">
              No Deal found! Add new deal.
            </p>
            <AddNewDeal setDealData={setDealData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BestDeals;
