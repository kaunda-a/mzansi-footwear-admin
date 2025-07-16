import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditDealForm from "@/components/forms/best-deal/edit-deal-form";
import { Pencil } from "lucide-react";
import type { BestDeal } from "@/lib/types/types";

export default function EditDeal({
  data,
  setDealData,
}: {
  data: BestDeal;
  setDealData: Dispatch<SetStateAction<BestDeal | null>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-teal1/60 shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Edit Deal
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <EditDealForm
            deal={data}
            onClose={() => setIsOpen(false)}
            setDealData={setDealData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
