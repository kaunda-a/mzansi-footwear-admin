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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ImagePicker from "@/components/offers/image-picker";
import { toast } from "sonner";
import { useAddDeal } from "@/api-hooks/best-deals/add-new-deal";
import {
  formItemSpacing,
  formContainerClasses
} from "@/lib/form-styles";
import type { FormFieldRenderProps } from "@/types/react-components";
import type { BestDeal } from "@/lib/types/types";

type FormData = z.infer<typeof ZodBestDealSchema>;

const NewDealForm = ({
  onClose,
  setDealData,
}: {
  onClose: () => void;
  setDealData: Dispatch<SetStateAction<BestDeal | null>>;
}) => {
  const [image, setImage] = useState("");

  const form = useForm<z.infer<typeof ZodBestDealSchema>>({
    resolver: zodResolver(ZodBestDealSchema),
    defaultValues: {
      description: "",
      id: "",
      price: "",
      slug: "",
      title: "",
    },
  });

  function onSuccess() {
    toast.success("New Deal added successfully.");
    onClose();
  }

  const mutation = useAddDeal(onSuccess);

  useEffect(() => {
    if (mutation.data) setDealData(mutation.data.newDeal);
  }, [mutation.data, setDealData]);

  async function handleCreateDeal(data: z.infer<typeof ZodBestDealSchema>) {
    mutation.mutate({ values: data, imageUrl: image });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateDeal)}
        className={formContainerClasses}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }: FormFieldRenderProps<FormData, "title">) => (
            <FormItem className={formItemSpacing}>
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
            <FormItem className={formItemSpacing}>
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
            <FormItem className={formItemSpacing}>
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
            <FormItem className={formItemSpacing}>
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
            <FormItem className={formItemSpacing}>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="relative w-full">
          {image ? (
            <>
              <Image src={image} alt="Deal preview" width={400} height={225} className="aspect-video w-full rounded-lg object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setImage("")}
                className="absolute -right-2 -top-2 z-10 h-8 w-8 rounded-full p-0"
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
            className="min-w-[100px]"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewDealForm;
