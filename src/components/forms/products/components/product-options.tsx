import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ProductFormProps } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AddColorDialog from "@/components/dialog/products/add-color-dialog";
import AddColorSection from "./add-color-section";
import { useGlobalContext } from "@/context/store";
import Image from "next/image";

const ProductOptions = ({ form }: ProductFormProps) => {
  const { colorVariants, setColorVariants } = useGlobalContext();
  const [disable, setDisable] = useState(false);

  return (
    <div className="flex-1 p-5 ps-3">
      <div className="mb-3 flex w-full items-center justify-between">
        <p className="font-medium">Color</p>
        <AddColorDialog form={form} setDisable={setDisable} />
      </div>
      <hr />
      <div className="mt-3">
        {colorVariants.length > 0 && (
          <h3 className="text-md font-medium mb-2">Added Colors:</h3>
        )}
        {colorVariants.map((variant, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Color:</span> {variant.color}
            {variant.thumbnail && (
              <Image src={variant.thumbnail} alt="thumbnail" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
            )}
            {variant.others && variant.others.length > 0 && (
              <span className="text-sm text-gray-500"> (+{variant.others.length} other images)</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductOptions;
