import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodHeroBannerSchema } from "@/lib/zod-schemas/schema";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HeroBanner } from "@prisma/client";
import { Info, Trash2 } from "lucide-react";
import ImagePicker from "@/components/offers/image-picker";
import { useUpdateHeroBanner } from "@/api-hooks/hero-banners/edit-banner";

import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodHeroBannerSchema>;

const EditBannerForm = ({
  banner,
  onClose,
  setBannerData,
}: {
  banner: HeroBanner;
  onClose: () => void;
  setBannerData: Dispatch<SetStateAction<HeroBanner[] | null>>;
}) => {
  const [image, setImage] = useState(banner.imageUrl);
  const [imageSm, setImageSm] = useState(banner.imageUrlSm);

  const form = useForm<z.infer<typeof ZodHeroBannerSchema>>({
    resolver: zodResolver(ZodHeroBannerSchema),
    defaultValues: {
      basePrice: banner.basePrice.toString(),
      description: banner.description,
      offerPrice: banner.offerPrice.toString(),
      title: banner.title,
      url: banner.url,
    },
  });

  function onSuccess() {
    toast.success("Banner edited successfully.");
    onClose();
  }

  const mutation = useUpdateHeroBanner(onSuccess);

  useEffect(() => {
    if (mutation.data) {
      setBannerData((prev) =>
        prev
          ? prev.map((value) =>
              value.id === banner.id ? mutation.data.updatedResult : value,
            )
          : null,
      );
    }
  }, [mutation.data, banner.id, setBannerData]);

  async function handleEditBanner(data: z.infer<typeof ZodHeroBannerSchema>) {
    mutation.mutate({
      id: banner.id,
      values: data,
      images: { image, imageSm },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEditBanner)}
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
                  placeholder="Enter banner title"
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
                  placeholder="Enter banner description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basePrice"
          render={({ field }: FormFieldRenderProps<FormData, "basePrice">) => (
            <FormItem className="mb-3">
              <FormLabel>Base Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter base price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="offerPrice"
          render={({ field }: FormFieldRenderProps<FormData, "offerPrice">) => (
            <FormItem className="mb-3">
              <FormLabel>Offer Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter offer price"
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
            <FormItem className="mb-3">
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
        <div className="relative w-full space-y-2">
          <span className="flex items-center gap-1 text-sm font-medium text-zinc-500">
            <Info size={15} />
            Upload <b>Large</b> version of the Banner Image
          </span>
          {image ? (
            <>
              <Image src={image} alt="Banner preview" width={400} height={225} className="aspect-video w-full object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setImage("")}
                className="absolute -right-2 -top-2 z-10 h-8 w-8 p-0 rounded-full bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Trash2 size={15} />
              </Button>
            </>
          ) : (
            <ImagePicker setImage={setImage} />
          )}
        </div>
        <div className="relative w-full space-y-2">
          <span className="flex items-center gap-1 text-sm font-medium text-zinc-500">
            <Info size={15} />
            Upload <b>Small</b> version of the Banner Image
          </span>
          {imageSm ? (
            <>
              <Image src={imageSm} alt="Small banner preview" width={300} height={300} className="aspect-square w-full object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setImageSm("")}
                className="absolute -right-2 -top-2 z-10 h-8 w-8 p-0 rounded-full bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Trash2 size={15} />
              </Button>
            </>
          ) : (
            <ImagePicker setImage={setImageSm} />
          )}
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending || !image || !imageSm}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditBannerForm;
