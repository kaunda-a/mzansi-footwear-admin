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
import { ZodAdminSchemaWithPassword } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateAdmin } from "@/api-hooks/admins/create-admin";

import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodAdminSchemaWithPassword>;

const CreateAdminForm = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<z.infer<typeof ZodAdminSchemaWithPassword>>({
    resolver: zodResolver(ZodAdminSchemaWithPassword),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "GUEST",
    },
  });

  const onSuccess = () => {
    toast.success("New admin created successfully.");
    onClose();
  };

  const mutation = useCreateAdmin(onSuccess);

  async function handleCreateAdmin(
    data: z.infer<typeof ZodAdminSchemaWithPassword>,
  ) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateAdmin)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }: FormFieldRenderProps<FormData, "name">) => (
            <FormItem className="space-y-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter admin name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: FormFieldRenderProps<FormData, "email">) => (
            <FormItem className="space-y-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter admin email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: FormFieldRenderProps<FormData, "password">) => (
            <FormItem className="space-y-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  autoComplete="new-password"
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
            <FormItem className="space-y-2">
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
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateAdminForm;
