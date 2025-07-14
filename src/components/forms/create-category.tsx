import { Button, Input } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ZodCategorySchema } from "@/lib/zod-schemas/schema";
import { useCreateCategory } from "@/api-hooks/categories/create-category";
import { standardInputStyles, formItemSpacing } from "@/lib/form-styles";

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
            render={({ field }) => (
              <FormItem className={formItemSpacing}>
                <FormControl>
                  <Input
                    {...standardInputStyles}
                    label="Category Name"
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
            render={({ field }) => (
              <FormItem className={formItemSpacing}>
                <FormControl>
                  <Input
                    {...standardInputStyles}
                    label="Parent ID (Optional)"
                    placeholder="Enter parent category ID"
                    type="number"
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
            color="danger"
            type="button"
            variant="light"
            onPress={onClose}
          >
            Close
          </Button>
          <Button color="primary" type="submit" isLoading={mutation.isPending}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCategoryForm;
