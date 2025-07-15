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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ZodCategorySchema } from "@/lib/zod-schemas/schema";
import { useCreateCategory } from "@/api-hooks/categories/create-category";

import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodCategorySchema>;

const CreateCategoryForm = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<z.infer<typeof ZodCategorySchema>>({
    resolver: zodResolver(ZodCategorySchema),
    defaultValues: {
      category: "",
      parentId: "",
    },
  });

  const onSuccess = () => {
    toast.success("New Category created successfully.");
    onClose();
  };

  const mutation = useCreateCategory(onSuccess);

  async function handleCreateAdmin(data: z.infer<typeof ZodCategorySchema>) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateAdmin)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }: FormFieldRenderProps<FormData, "category">) => (
              <FormItem className="space-y-2">
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }: FormFieldRenderProps<FormData, "parentId">) => (
              <FormItem className="space-y-2">
                <FormLabel>Parent ID (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter parent category ID"
                    {...field}
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
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCategoryForm;
