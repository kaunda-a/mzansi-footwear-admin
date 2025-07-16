import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ZodAdminSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AdminProps, EditAdminResProps } from "@/lib/types/types";
import { useUpdateAdmin } from "@/api-hooks/admins/edit-admin";
import type { FormFieldRenderProps } from "@/types/react-components";

// Use the actual schema type
type FormData = Partial<z.infer<typeof ZodAdminSchema>>;

const EditAdminForm = ({
  onClose,
  admin,
}: {
  onClose: () => void;
  admin: AdminProps;
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(ZodAdminSchema.partial()),
    defaultValues: {
      name: admin.name,
      email: admin.email,
      password: undefined,
      role: admin.role === "SUPERADMIN" ? "GUEST" : admin.role,
    },
  });

  const onSuccess = (data: EditAdminResProps) => {
    toast.success("Admin details updated successfully.");
    form.reset({
      name: data.admin?.name,
      email: data.admin?.email,
      password: "",
      role: data.admin?.role === "SUPERADMIN" ? "GUEST" : data.admin?.role,
    });
    onClose();
  };

  const mutation = useUpdateAdmin(onSuccess);

  async function handleUpdateAdmin(data: FormData) {
    mutation.mutate({
      id: admin.id,
      values: {
        name: data.name || admin.name,
        email: data.email || admin.email,
        password: data.password,
        role: data.role || admin.role,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateAdmin)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }: FormFieldRenderProps<FormData, "name">) => (
            <FormItem className="mb-3">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter admin name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: FormFieldRenderProps<FormData, "email">) => (
            <FormItem className="mb-3">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter admin email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: FormFieldRenderProps<FormData, "password">) => (
            <FormItem className="mb-3">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password (optional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }: FormFieldRenderProps<FormData, "role">) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["ADMIN", "GUEST"].map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
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

export default EditAdminForm;
