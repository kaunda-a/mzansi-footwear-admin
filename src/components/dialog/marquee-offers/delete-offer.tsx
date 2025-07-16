import { useDeleteOffer } from "@/api-hooks/marquee-offers/delete-offer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import type { MarqueeOffers } from "@/lib/types/types";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

const DeleteMarqueeOffer = ({
  id,
  setOffersData,
}: {
  id: number;
  setOffersData: Dispatch<SetStateAction<MarqueeOffers[] | null>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSuccess = () => {
    toast.success("Offer deleted successfully.");
    setIsOpen(false);
    setOffersData((prev) =>
      prev ? prev.filter((offer) => offer.id !== id) : null,
    );
  };

  // Delete OFFER function
  const delete_mutation = useDeleteOffer(onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Trash2 size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Delete offer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Delete Offer?
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            This action will remove this offer from the database.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="text-zinc-600 dark:text-zinc-400"
          >
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={() => delete_mutation.mutate(id)}
            disabled={delete_mutation.isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {delete_mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMarqueeOffer;
