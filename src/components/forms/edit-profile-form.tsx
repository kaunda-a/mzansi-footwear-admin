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
import { ZodProfileSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useUpdateProfile } from "@/api-hooks/edit-profile";
import { AdminProfileResProps } from "@/lib/types/types";

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
      name: data.data.name,
      image: data.data.image,
    });
    form.reset({
      name: data.data.name,
      image: data.data.image,
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
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input placeholder="Name" {...field} radius="sm" size="sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input placeholder="Image URL" {...field} radius="sm" size="sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            color="danger"
            type="button"
            variant="light"
            onPress={onClose}
          >
            Close
          </Button>
          <Button
            color="primary"
            form="edit-profile"
            type="submit"
            isLoading={mutation.isPending}
            isDisabled={!form.formState.isDirty}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
