import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodMarqueeOfferSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useCreateOffer } from "@/api-hooks/marquee-offers/create-offer";
import { Dispatch, SetStateAction, useEffect } from "react";
import type { MarqueeOffers } from "@/lib/types/types";
import { formItemSpacing } from "@/lib/form-styles";
import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodMarqueeOfferSchema>;

const NewOfferForm = ({
  onClose,
  setOffersData,
}: {
  onClose: () => void;
  setOffersData: Dispatch<SetStateAction<MarqueeOffers[] | null>>;
}) => {
  const form = useForm<z.infer<typeof ZodMarqueeOfferSchema>>({
    resolver: zodResolver(ZodMarqueeOfferSchema),
  });

  function onSuccess() {
    toast.success("New Marquee offer added successfully.");
    onClose();
  }

  const mutation = useCreateOffer(onSuccess);

  useEffect(() => {
    if (mutation.data)
      setOffersData((prev) =>
        prev ? [...prev, mutation.data.newOffer] : [mutation.data.newOffer],
      );
  }, [mutation.data, setOffersData]);

  async function handleCreateOffer(
    data: z.infer<typeof ZodMarqueeOfferSchema>,
  ) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateOffer)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }: FormFieldRenderProps<FormData, "title">) => (
            <FormItem className={formItemSpacing}>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter offer title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }: FormFieldRenderProps<FormData, "url">) => (
            <FormItem className={formItemSpacing}>
              <FormLabel>Product URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Enter product URL"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex items-center justify-end gap-4">
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

export default NewOfferForm;
