import { Button, Image, Input, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodBestDealSchema } from "@/lib/zod-schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ImagePicker from "@/components/offers/image-picker";
import { useUpdateDeal } from "@/api-hooks/best-deals/edit-deal";
import { BestDeal } from "@prisma/client";
import { toast } from "sonner";
import { standardInputStyles, standardTextareaStyles, formItemSpacing } from "@/lib/form-styles";

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
          name="id"
          render={({ field }) => (
            <FormItem className={formItemSpacing}>
              <FormControl>
                <Input
                  {...standardInputStyles}
                  label="Product ID"
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
          render={({ field }) => (
            <FormItem className={formItemSpacing}>
              <FormControl>
                <Input
                  {...standardInputStyles}
                  label="Product Slug"
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
          render={({ field }) => (
            <FormItem className={formItemSpacing}>
              <FormControl>
                <Textarea
                  {...standardTextareaStyles}
                  label="Description"
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
          render={({ field }) => (
            <FormItem className={formItemSpacing}>
              <FormControl>
                <Input
                  {...standardInputStyles}
                  label="Product Price"
                  type="number"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">R</span>
                    </div>
                  }
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
              <Image src={image} alt="" className="aspect-video" />
              <Button
                isIconOnly
                size="sm"
                color="danger"
                startContent={<Trash2 size={15} />}
                radius="full"
                onClick={() => setImage("")}
                className="absolute -right-2 -top-2 z-10 bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
              />
            </>
          ) : (
            <ImagePicker setImage={setImage} />
          )}
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            color="primary"
            type="submit"
            isLoading={mutation.isPending}
            isDisabled={!image}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditDealForm;
