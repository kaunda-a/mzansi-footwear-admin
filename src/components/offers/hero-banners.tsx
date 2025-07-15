"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HeroBanner } from "@prisma/client";
import { useState } from "react";
import HeroBannerTable from "./tables/hero-banner-table";

const HeroBanners = ({ banners }: { banners: HeroBanner[] }) => {
  const [bannerData, setBannerData] = useState<HeroBanner[] | null>(banners);
  return (
    <Card className="my-5 shadow-md @container">
      <CardContent className="p-6 [&>div]:gap-1">
        <HeroBannerTable data={bannerData} setBannerData={setBannerData} />
      </CardContent>
    </Card>
  );
};

export default HeroBanners;
