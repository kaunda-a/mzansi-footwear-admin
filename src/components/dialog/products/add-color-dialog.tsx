import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import AddColorSection from "@/components/forms/products/components/add-color-section";
import { useGlobalContext } from "@/context/store";
import { ProductFormProps } from "@/lib/types/types";
import { Button } from "@nextui-org/react";
import MagicButton from "@/components/ui/button";

const AddColorDialog = ({ form, setDisable }: ProductFormProps) => {
  const { colorVariants, setColorVariants } = useGlobalContext();

  function addColorSection() {
    setColorVariants((prevVariant) => [
      ...prevVariant,
      { color: "", thumbnail: "", others: [] },
    ]);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MagicButton
          isIconOnly
          type="button"
          onClick={() => {
            // addColorSection(); // Removed this call
          }}
          className="bg-white/80 dark:bg-zinc-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-zinc-700/40 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white dark:hover:bg-zinc-700/70"
        >
          <Plus />
        </MagicButton>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new color</SheetTitle>
          <SheetDescription>
            Add a new color variant to your product.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-5">
          <MagicButton onClick={addColorSection} className="mb-4">Add New Color</MagicButton>
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
      </SheetContent>
    </Sheet>
  );
};

export default AddColorDialog;
