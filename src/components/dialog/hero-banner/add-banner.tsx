import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { HeroBanner } from "@prisma/client";
import NewBannerForm from "@/components/forms/hero-banner/new-banner-form";

export default function AddBanner({
  setBannerData,
}: {
  setBannerData: Dispatch<SetStateAction<HeroBanner[] | null>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-xl max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Add New Banner
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 max-h-[400px] overflow-y-auto scrollbar-thin">
          <NewBannerForm
            onClose={handleClose}
            setBannerData={setBannerData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
