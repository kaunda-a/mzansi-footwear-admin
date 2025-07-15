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
import { Dispatch, SetStateAction, useEffect } from "react";
import type { MarqueeOffers } from "@/lib/types/types";
import { useUpdateMarqueeOffer } from "@/api-hooks/marquee-offers/edit-deal";


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
          render={({ field }: { field: any }) => (
            <FormItem className="space-y-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
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
          render={({ field }: { field: any }) => (
            <FormItem className="space-y-2">
              <FormLabel>Product URL</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
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

export default EditOfferForm;
