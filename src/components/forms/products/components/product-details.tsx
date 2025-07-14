import { useCategoryEndChild } from "@/api-hooks/categories/get-end-child";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ProductFormProps } from "@/lib/types/types";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

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
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                isRequired
                label="Title"
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                classNames={{
                  label: "font-medium z-0",
                  inputWrapper: [
                    "border-2",
                    "border-slate-200/60",
                    "bg-transparent",
                    "dark:border-zinc-700/40",
                    "group-data-[focus=true]:border-blue-500/60",
                    "dark:group-data-[focus=true]:border-blue-500/60",
                    "group-data-[hover=true]:border-slate-300",
                    "dark:group-data-[hover=true]:border-zinc-600",
                  ],
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem className="mt-3">
            <FormControl style={{ margin: "0" }}>
              <div className="flex items-end gap-2">
                <Input
                  {...field}
                  isRequired
                  label="Slug"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  classNames={{
                    label: "font-medium z-0",
                    inputWrapper: [
                      "border-2",
                      "border-slate-200/60",
                      "bg-transparent",
                      "dark:border-zinc-700/40",
                      "group-data-[focus=true]:border-blue-500/60",
                      "dark:group-data-[focus=true]:border-blue-500/60",
                      "group-data-[hover=true]:border-slate-300",
                      "dark:group-data-[hover=true]:border-zinc-600",
                    ],
                  }}
                />
                <Button type="button" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem className="mt-9">
            <FormControl>
              <Input
                {...field}
                label="Short Description"
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                classNames={{
                  label: "font-medium z-0",
                  inputWrapper: [
                    "border-2",
                    "border-slate-200/60",
                    "bg-transparent",
                    "dark:border-zinc-700/40",
                    "group-data-[focus=true]:border-blue-500/60",
                    "dark:group-data-[focus=true]:border-blue-500/60",
                    "group-data-[hover=true]:border-slate-300",
                    "dark:group-data-[hover=true]:border-zinc-600",
                  ],
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="mt-3">
            <FormControl>
              <Textarea
                label="Description"
                labelPlacement="outside"
                radius="lg"
                variant="bordered"
                classNames={{
                  label: "text-sm font-medium z-0",
                  inputWrapper: [
                    "border-2",
                    "border-slate-200/60",
                    "bg-transparent",
                    "dark:border-zinc-700/40",
                    "group-data-[focus=true]:border-blue-500/60",
                    "dark:group-data-[focus=true]:border-blue-500/60",
                    "group-data-[hover=true]:border-slate-300",
                    "dark:group-data-[hover=true]:border-zinc-600",
                  ],
                }}
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  label="Category Id"
                  labelPlacement="outside"
                  onChange={field.onChange}
                  selectedKeys={field.value ? [field.value] : []}
                  radius="lg"
                  isRequired
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium z-0",
                    trigger: [
                      "border-2",
                      "border-slate-200/60",
                      "bg-transparent",
                      "dark:border-zinc-700/40",
                      "group-data-[focus=true]:border-blue-500/60",
                      "dark:group-data-[focus=true]:border-blue-500/60",
                      "group-data-[hover=true]:border-slate-300",
                      "dark:group-data-[hover=true]:border-zinc-600",
                      "mt-1",
                      "h-unit-10",
                    ],
                  }}
                >
                  {categoriesLoading ? (
                    <SelectItem key="loading" value="loading" isDisabled>
                      Loading categories...
                    </SelectItem>
                  ) : categoriesError ? (
                    <SelectItem key="error" value="error" isDisabled>
                      Error loading categories
                    </SelectItem>
                  ) : categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id.toString()} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="empty" value="empty" isDisabled>
                      No categories available
                    </SelectItem>
                  )}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem className="mt-1">
              <FormControl>
                <Input
                  {...field}
                  isRequired
                  label="Stock"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  classNames={{
                    label: "font-medium z-0",
                    inputWrapper: [
                      "border-2",
                      "border-slate-200/60",
                      "bg-transparent",
                      "dark:border-zinc-700/40",
                      "group-data-[focus=true]:border-blue-500/60",
                      "dark:group-data-[focus=true]:border-blue-500/60",
                      "group-data-[hover=true]:border-slate-300",
                      "dark:group-data-[hover=true]:border-zinc-600",
                    ],
                  }}
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
            render={({ field }) => (
              <FormItem className="mt-1">
                <FormControl>
                  <Input
                    {...field}
                    isRequired
                    label={item.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    classNames={{
                      label: "font-medium capitalize z-0",
                      input: "placeholder:capitalize",
                      inputWrapper: [
                        "border-2",
                        "border-slate-200/60",
                        "bg-transparent",
                        "dark:border-zinc-700/40",
                        "group-data-[focus=true]:border-blue-500/60",
                        "dark:group-data-[focus=true]:border-blue-500/60",
                        "group-data-[hover=true]:border-slate-300",
                        "dark:group-data-[hover=true]:border-zinc-600",
                      ],
                    }}
                  />
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
