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
import type { BestDeal } from "@/lib/types/types";
import NewDealForm from "@/components/forms/best-deal/new-deal-form";

export default function AddNewDeal({
  setDealData,
}: {
  setDealData: Dispatch<SetStateAction<BestDeal | null>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="h-12 w-12 rounded-full p-0"
        >
          <Plus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Add New Deal
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <NewDealForm onClose={() => setIsOpen(false)} setDealData={setDealData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
