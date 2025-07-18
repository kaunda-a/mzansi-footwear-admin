"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CreateAdminForm from "../../forms/create-admin";
import { useState } from "react";

const CreateAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus size={15} />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-teal1/60 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Create new admin
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <CreateAdminForm onClose={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdmin;
