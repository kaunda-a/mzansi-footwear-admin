"use client";

import { Form } from "@/components/ui/form";
import { ZodProductSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ProductDetails from "./components/product-details";
import ProductOptions from "./components/product-options";
import { useGlobalContext } from "@/context/store";
import { useAddProduct } from "@/api-hooks/products/add-product";
import { useCategoryEndChild } from "@/api-hooks/categories/get-end-child";
import { useEffect, useState } from "react";

const AddProductForm = () => {
  const { colorVariants, setColorVariants } = useGlobalContext();
  const { data: categories } = useCategoryEndChild();
  const [disable, setDisable] = useState(false);

  const form = useForm<z.infer<typeof ZodProductSchema>>({
    resolver: zodResolver(ZodProductSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      categoryId: "",
      stock: "",
      basePrice: "",
      offerPrice: "",
      colors: [{}],
      variantName: "",
      variantValues: "",
      keywords: "",
    },
  });

  useEffect(() => {
    setColorVariants([]);
  }, [setColorVariants]);

  const onSuccess = () => {
    toast.success("Product added successfully.");
    form.reset();
    setColorVariants([]);
  };

  const add_product_mutation = useAddProduct(onSuccess);

  function setColors() {
    form.setValue("colors", colorVariants);
  }

  async function onSubmit(values: z.infer<typeof ZodProductSchema>) {
    add_product_mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-teal1/60 shadow-xl rounded-2xl p-4"
      >

        <div className="flex flex-col md:flex-row">
          <ProductDetails form={form} setDisable={setDisable} />
          <ProductOptions form={form} setDisable={setDisable} />
        </div>
        <div className="flex justify-end border-t p-5">
          <Button
            type="submit"
            onClick={setColors}
            disabled={add_product_mutation.isPending || !form.formState.isDirty}
          >
            {add_product_mutation.isPending ? "Adding Product..." : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddProductForm;
