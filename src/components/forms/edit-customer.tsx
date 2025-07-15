"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import { ZodCustomerSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@/lib/types/types";
import { useUpdateCustomer } from "@/api-hooks/customers/edit-customers";
import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodCustomerSchema>;

const EditCustomerForm = ({ customer }: { customer: Customer }) => {
  const form = useForm({
    resolver: zodResolver(ZodCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      password: "",
      gender: customer.gender,
      phone: customer.phone,
    },
  });

  const mutation = useUpdateCustomer();

  async function handleUpdateCustomer(data: FormData) {
    mutation.mutate({ id: customer.id, values: data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateCustomer)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }: FormFieldRenderProps) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input placeholder="Name" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: FormFieldRenderProps) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input placeholder="Email" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: FormFieldRenderProps) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...field}
                  className="h-9"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }: FormFieldRenderProps) => (
            <FormItem className="mb-3">
              <FormControl>
                <Input placeholder="Phone" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }: FormFieldRenderProps) => (
            <FormItem className="mb-3">
              <FormLabel>Select gender</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending || !form.formState.isDirty}
            className="bg-primary hover:bg-primary/90"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCustomerForm;
