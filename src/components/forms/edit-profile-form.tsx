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
import { ZodProfileSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useUpdateProfile } from "@/api-hooks/edit-profile";
import { AdminProfileResProps } from "@/lib/types/types";
import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodProfileSchema>;

const EditProfileForm = ({
  onClose,
  update,
}: {
  onClose: () => void;
  update: any;
}) => {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof ZodProfileSchema>>({
    resolver: zodResolver(ZodProfileSchema),
    defaultValues: {
      name: session?.user.name || "",
      image: session?.user.image || "",
    },
  });

  const onSuccess = (data: AdminProfileResProps) => {
    toast.success("Profile updated successfully");
    update({
      user: data,
    });
    form.reset({
      name: data.name,
      image: data.image,
    });
    onClose();
  };

  const mutation = useUpdateProfile(onSuccess);

  async function handleUpdateProfile(data: z.infer<typeof ZodProfileSchema>) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateProfile)} id="edit-profile">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: any }) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input placeholder="Name" {...field} className="rounded-sm h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }: { field: any }) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input placeholder="Image URL" {...field} className="rounded-sm h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            form="edit-profile"
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

export default EditProfileForm;
