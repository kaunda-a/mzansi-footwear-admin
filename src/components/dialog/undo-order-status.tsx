"use client";

import { useUpdateOrderStatus } from "@/api-hooks/orders/update-status";
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
import { Dispatch, SetStateAction, useState } from "react";

const UndoOrderStatus = ({
  oid,
  status,
  setStatus,
}: {
  oid: string;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function onSuccess() {
    setIsOpen(false);
    setStatus(status === "delivered" ? "ongoing" : "pending");
  }

  const mutation = useUpdateOrderStatus(onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-primary hover:text-primary/80"
          disabled={status === "pending"}
        >
          undo
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Update Status
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Are you want to update the order status from{" "}
            <b className="font-medium text-[#46D483]">
              {status === "delivered" ? "Delivered" : "Packed & Shipping"}
            </b>{" "}
            to{" "}
            <b className="font-medium text-[#46D483]">
              {status === "delivered"
                ? "Packed & Shipping"
                : "Order Placed"}
            </b>{" "}
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Close
          </Button>
          <Button
            variant="default"
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                id: oid,
                status: status === "delivered" ? "ongoing" : "pending",
              })
            }
            className="bg-primary hover:bg-primary/90"
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UndoOrderStatus;
