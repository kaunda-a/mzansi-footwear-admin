"use client";

import { Card, CardContent } from "@/components/ui/card";
import MarqueeOffersTable from "./tables/marquee-offers-table";
import type { MarqueeOffers } from "@prisma/client";
import CreateOffers from "../dialog/marquee-offers/create-offers";
import { useState } from "react";

const MarqueeOffers = ({ offers }: { offers: MarqueeOffers[] }) => {
  const [offersData, setOffersData] = useState<MarqueeOffers[] | null>(offers);

  return (
    <Card className="my-5 shadow-md @container">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-medium md:text-lg">Marquee Offers</h1>
          <CreateOffers setOffersData={setOffersData} />
        </div>
        <MarqueeOffersTable data={offersData} setOffersData={setOffersData} />
      </CardContent>
    </Card>
  );
};

export default MarqueeOffers;
