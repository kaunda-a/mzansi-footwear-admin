import Nav from "@/components/nav/nav";
import BestDeals from "@/components/offers/best-deals";
import HeroBanners from "@/components/offers/hero-banners";
import MarqueeOffers from "@/components/offers/marquee-offers";
import { getDealsAndOffers } from "@/lib/api/get-deals-and-offers";

const Offers = async () => {
  try {
    const data = await getDealsAndOffers();

    return (
      <Nav>
        <h1 className="text-zinc-400 md:text-xl">Best Deals & Offers</h1>
        <BestDeals deal={data?.deal || null} />
        <MarqueeOffers offers={data?.offers || []} />
        <HeroBanners banners={data?.banners || []} />
      </Nav>
    );
  } catch (error) {
    return (
      <Nav>
        <h1 className="text-zinc-400 md:text-xl">Best Deals & Offers</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600 mb-2">
              Unable to Load Offers
            </div>
            <div className="text-sm text-gray-500">
              There was an error loading the offers data. Please try refreshing the page.
            </div>
          </div>
        </div>
      </Nav>
    );
  }
};

export default Offers;
