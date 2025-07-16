import { useDeleteCategory } from "@/api-hooks/categories/delete-category";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const DeleteCategory = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSuccess = () => {
    toast.success("Category deleted successfully.");
    setIsOpen(false);
  };

  // Delete address function
  const delete_mutation = useDeleteCategory(onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Category</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-teal1/60 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Delete Category?
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <p className="text-sm dark:text-zinc-400">
            This action cannot be undone!
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={() => delete_mutation.mutate(id)}
            disabled={delete_mutation.isPending}
          >
            {delete_mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategory;
