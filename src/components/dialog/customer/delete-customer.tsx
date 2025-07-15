import { useDeleteCustomer } from "@/api-hooks/customers/delete-customer";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const DeleteCustomer = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSuccess = () => {
    toast.success("Customer deleted successfully.");
    setIsOpen(false);
  };

  // Delete address function
  const delete_mutation = useDeleteCustomer(onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Delete customer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/60 dark:border-zinc-700/60 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Delete Customer?
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            This action will remove this customer from the database.
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

export default DeleteCustomer;
