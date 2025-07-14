"use client";

import BestDeals from "@/components/offers/best-deals";
import HeroBanners from "@/components/offers/hero-banners";
import MarqueeOffers from "@/components/offers/marquee-offers";
import { useOffersData } from "@/api-hooks/offers/get-offers-data";
import { Skeleton, Card, CardBody, Button } from "@nextui-org/react";
import { RefreshCw, AlertCircle } from "lucide-react";

const OffersClient = () => {
  const { data, isLoading, error, refetch } = useOffersData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-zinc-400 md:text-xl">Best Deals & Offers</h1>
        
        {/* Best Deal Skeleton */}
        <Card className="shadow-md">
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <Skeleton className="aspect-video w-full" />
              <div className="col-span-2 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Marquee Offers Skeleton */}
        <Card className="shadow-md">
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Hero Banners Skeleton */}
        <Card className="shadow-md">
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="grid grid-cols-1 gap-3 lg:grid-cols-3 p-3 border rounded-lg">
                  <Skeleton className="aspect-video w-full" />
                  <div className="col-span-2 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-zinc-400 md:text-xl">Best Deals & Offers</h1>
        <Card className="shadow-md">
          <CardBody>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Unable to Load Offers
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                There was an error loading the offers data. This might be due to a network issue or server problem.
              </div>
              <Button
                color="primary"
                variant="bordered"
                startContent={<RefreshCw className="h-4 w-4" />}
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-zinc-400 md:text-xl">Best Deals & Offers</h1>
      <BestDeals deal={data?.deal || null} />
      <MarqueeOffers offers={data?.offers || []} />
      <HeroBanners banners={data?.banners || []} />
    </div>
  );
};

export default OffersClient;
