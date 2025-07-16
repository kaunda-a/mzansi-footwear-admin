"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarqueeOffers } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import EditOfferForm from "@/components/forms/marquee-offers/edit-offer-form";
import { Pencil } from "lucide-react";

export default function EditMarqueeOffer({
  offer,
  setOffersData,
}: {
  offer: MarqueeOffers;
  setOffersData: Dispatch<SetStateAction<MarqueeOffers[] | null>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-zinc-500 hover:text-zinc-700 bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Pencil size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Edit offer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-xl max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Edit Offer
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 max-h-[400px] overflow-y-auto scrollbar-thin">
          <EditOfferForm
            offer={offer}
            onClose={handleClose}
            setOffersData={setOffersData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
