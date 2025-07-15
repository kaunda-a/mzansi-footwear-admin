import { Button, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodMarqueeOfferSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect } from "react";
import type { MarqueeOffers } from "@/lib/types/types";
import { useUpdateMarqueeOffer } from "@/api-hooks/marquee-offers/edit-deal";
import { standardInputStyles, formItemSpacing } from "@/lib/form-styles";

const EditOfferForm = ({
  offer,
  onClose,
  setOffersData,
}: {
  offer: MarqueeOffers;
  onClose: () => void;
  setOffersData: Dispatch<SetStateAction<MarqueeOffers[] | null>>;
}) => {
  const form = useForm<z.infer<typeof ZodMarqueeOfferSchema>>({
    resolver: zodResolver(ZodMarqueeOfferSchema),
    defaultValues: {
      title: offer.title,
      url: offer.url,
    },
  });

  function onSuccess() {
    toast.success("Marquee offer edited successfully.");
    onClose();
  }

  const mutation = useUpdateMarqueeOffer(onSuccess);

  useEffect(() => {
    if (mutation.data) {
      setOffersData((prev) =>
        prev
          ? prev.map((value) =>
              value.id === offer.id ? mutation.data.updatedResult : value,
            )
          : null,
      );
    }
  }, [mutation.data, offer.id, setOffersData]);

  async function handleCreateOffer(
    data: z.infer<typeof ZodMarqueeOfferSchema>,
  ) {
    mutation.mutate({ id: offer.id, values: data });
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
          render={({ field }) => (
            <FormItem className={formItemSpacing}>
              <FormControl>
                <Input
                  {...standardInputStyles}
                  label="Title"
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
          render={({ field }) => (
            <FormItem className={formItemSpacing}>
              <FormControl>
                <Input
                  {...standardInputStyles}
                  label="Product URL"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            color="primary"
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

export default EditOfferForm;
