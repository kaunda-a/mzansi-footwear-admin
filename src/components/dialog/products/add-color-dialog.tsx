import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddColorSection from "@/components/forms/products/components/add-color-section";
import { useGlobalContext } from "@/context/store";
import { ProductFormProps } from "@/lib/types/types";
import { useState } from "react";

const AddColorDialog = ({ form, setDisable }: ProductFormProps) => {
  const { colorVariants, setColorVariants } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

  function addColorSection() {
    setColorVariants((prevVariant) => [
      ...prevVariant,
      { color: "", thumbnail: "", others: [] },
    ]);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={() => {
            // addColorSection(); // Removed this call
          }}
          className="bg-white/80 dark:bg-zinc-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-zinc-700/40 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white dark:hover:bg-zinc-700/70"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add new color</DialogTitle>
          <DialogDescription>
            Add a new color variant to your product.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5">
          <Button onClick={addColorSection} className="mb-4">Add New Color</Button>
          {colorVariants.map((variant, i) => (
            <AddColorSection
              form={form}
              index={i}
              variant={variant}
              setDisable={setDisable}
              key={i}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddColorDialog;
