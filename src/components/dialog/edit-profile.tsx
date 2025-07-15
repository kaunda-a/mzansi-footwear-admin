'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "../forms/edit-profile-form";

export default function EditProfile({ update }: { update: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ms-auto">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/60 dark:border-zinc-700/60 shadow-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <EditProfileForm onClose={handleClose} update={update} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
