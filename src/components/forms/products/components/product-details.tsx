import { useCategoryEndChild } from "@/api-hooks/categories/get-end-child";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProductFormProps } from "@/lib/types/types";
import type { FormFieldRenderProps } from "@/types/react-components";
import { z } from "zod";
import { ZodProductSchema } from "@/lib/zod-schemas/schema";

type FormData = z.infer<typeof ZodProductSchema>;

const ProductDetails = ({ form }: ProductFormProps) => {
  function generateSlug() {
    const name = form.getValues("title");
    if (name) {
      const slug = name.replaceAll(" ", "-").toLowerCase();
      form.setValue("slug", slug);
    }
  }

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategoryEndChild();

  return (
    <div className="flex-1 p-5 pe-3">
      <FormField
        control={form.control}
        name="title"
        render={({ field }: FormFieldRenderProps<FormData, "title">) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter product title"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug"
        render={({ field }: FormFieldRenderProps<FormData, "slug">) => (
          <FormItem className="mt-3">
            <FormLabel>Slug</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  placeholder="product-slug"
                  {...field}
                />
              </FormControl>
              <Button type="button" onClick={generateSlug} variant="outline">
                Generate
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="shortDescription"
        render={({ field }: FormFieldRenderProps<FormData, "shortDescription">) => (
          <FormItem className="mt-9">
            <FormLabel>Short Description</FormLabel>
            <FormControl>
              <Input
                placeholder="Brief product description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }: FormFieldRenderProps<FormData, "description">) => (
          <FormItem className="mt-3">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Detailed product description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }: FormFieldRenderProps<FormData, "categoryId">) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categoriesError ? (
                    <SelectItem value="error" disabled>
                      Error loading categories
                    </SelectItem>
                  ) : categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id.toString()} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }: FormFieldRenderProps<FormData, "stock">) => (
            <FormItem className="mt-1">
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {(["basePrice", "offerPrice"] as const).map((item, i) => (
          <FormField
            key={i}
            control={form.control}
            name={item}
            render={({ field }: FormFieldRenderProps<FormData, "basePrice" | "offerPrice">) => (
              <FormItem className="mt-1">
                <FormLabel className="capitalize">
                  {item.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
