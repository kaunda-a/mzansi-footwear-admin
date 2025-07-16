import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodCategorySchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Category, EditCategoryRes } from "@/lib/types/types";
import { useUpdateCategory } from "@/api-hooks/categories/edit-category";
import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodCategorySchema>;

const EditCategoryForm = ({
  onClose,
  category,
}: {
  onClose: () => void;
  category: Category;
}) => {
  const form = useForm<z.infer<typeof ZodCategorySchema>>({
    resolver: zodResolver(ZodCategorySchema),
    defaultValues: {
      category: category.name,
      parentId: category.parentId?.toString(),
    },
  });

  const onSuccess = (data: EditCategoryRes) => {
    toast.success("Category updated successfully.");
    form.reset({
      category: data.category.name,
      parentId: data.category.parentId?.toString(),
    });
    onClose();
  };

  const mutation = useUpdateCategory(onSuccess);

  async function handleUpdateAdmin(data: z.infer<typeof ZodCategorySchema>) {
    mutation.mutate({ id: category.id, values: data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateAdmin)}>
        <div className="mb-1 flex gap-1">
          <FormField
            control={form.control}
            name="category"
            render={({ field }: FormFieldRenderProps<FormData, "category">) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Name" {...field} radius="sm" size="sm" classNames={{
                    inputWrapper: "border border-slate-200/60 bg-white/50 dark:border-teal1/60 dark:bg-zinc-900/50 backdrop-blur-md",
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }: FormFieldRenderProps<FormData, "parentId">) => (
              <FormItem className="max-w-[120px]">
                <FormControl>
                  <Input
                    placeholder="Parent ID (optional)"
                    type="number"
                    {...field}
                    radius="sm"
                    size="sm"
                    classNames={{
                      inputWrapper: "border border-slate-200/60 bg-white/50 dark:border-teal1/60 dark:bg-zinc-900/50 backdrop-blur-md",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending || !form.formState.isDirty}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCategoryForm;
