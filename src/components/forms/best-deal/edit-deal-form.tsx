import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodBestDealSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ImagePicker from "@/components/offers/image-picker";
import { useUpdateDeal } from "@/api-hooks/best-deals/edit-deal";
import { toast } from "sonner";

import type { FormFieldRenderProps } from "@/types/react-components";
import type { BestDeal } from "@/lib/types/types";

type FormData = z.infer<typeof ZodBestDealSchema>;

const EditDealForm = ({
  deal,
  onClose,
  setDealData,
}: {
  deal: BestDeal;
  onClose: () => void;
  setDealData: Dispatch<SetStateAction<BestDeal | null>>;
}) => {
  const [image, setImage] = useState("");

  const form = useForm<z.infer<typeof ZodBestDealSchema>>({
    resolver: zodResolver(ZodBestDealSchema),
    defaultValues: {
      title: deal.title,
      id: deal.url.split("=")[1],
      slug: deal.url.split("?")[0].split("/").at(-1),
      description: deal.description,
      price: deal.price.toString(),
    },
  });

  useEffect(() => {
    setImage(deal.imageUrl);
  }, [deal.imageUrl]);

  function onSuccess() {
    toast.success("Deal updated successfully.");
    onClose();
  }

  const mutation = useUpdateDeal(onSuccess);

  useEffect(() => {
    if (mutation.data) setDealData(mutation.data.updatedResult);
  }, [mutation.data, setDealData]);

  async function handleUpdateDeal(data: z.infer<typeof ZodBestDealSchema>) {
    mutation.mutate({ id: deal.id, values: data, imageUrl: image });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateDeal)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }: FormFieldRenderProps<FormData, "title">) => (
            <FormItem className="space-y-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter deal title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id"
          render={({ field }: FormFieldRenderProps<FormData, "id">) => (
            <FormItem className="space-y-2">
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product ID"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }: FormFieldRenderProps<FormData, "slug">) => (
            <FormItem className="space-y-2">
              <FormLabel>Product Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter product slug"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }: FormFieldRenderProps<FormData, "description">) => (
            <FormItem className="space-y-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter deal description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }: FormFieldRenderProps<FormData, "price">) => (
            <FormItem className="space-y-2">
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter product price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="relative w-full">
          {image ? (
            <>
              <Image src={image} alt="Deal preview" width={400} height={225} className="aspect-video w-full object-cover rounded-lg" />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setImage("")}
                className="absolute -right-2 -top-2 z-10 bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200 rounded-full h-8 w-8 p-0"
              >
                <Trash2 size={15} />
              </Button>
            </>
          ) : (
            <ImagePicker setImage={setImage} />
          )}
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending || !image}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditDealForm;
