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
import EditAdminForm from "../../forms/edit-admin-form";
import { Pencil } from "lucide-react";
import { AdminProps } from "@/lib/types/types";
import { useState } from "react";

const EditAdmin = ({ admin }: { admin: AdminProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-default-400 active:opacity-50 bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Pencil size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit admin</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Edit Admin
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <EditAdminForm onClose={() => setIsOpen(false)} admin={admin} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdmin;
