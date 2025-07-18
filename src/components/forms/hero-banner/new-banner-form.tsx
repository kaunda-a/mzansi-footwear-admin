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
import { Info, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ImagePicker from "@/components/offers/image-picker";
import type { HeroBanner } from "@/lib/types/types";
import { toast } from "sonner";
import { useAddBanner } from "@/api-hooks/hero-banners/add-new-banner";


const NewBannerForm = ({
  onClose,
  setBannerData,
}: {
  onClose: () => void;
  setBannerData: Dispatch<SetStateAction<HeroBanner[] | null>>;
}) => {
  const [image, setImage] = useState("");
  const [imageSm, setImageSm] = useState("");

  const form = useForm<z.infer<typeof ZodHeroBannerSchema>>({
    resolver: zodResolver(ZodHeroBannerSchema),
    defaultValues: {
      basePrice: "",
      description: "",
      offerPrice: "",
      title: "",
      url: "",
    },
  });

  function onSuccess() {
    toast.success("New Banner added successfully.");
    onClose();
  }

  const mutation = useAddBanner(onSuccess);

  useEffect(() => {
    if (mutation.data) {
      setBannerData((prev) =>
        prev ? [...prev, mutation.data.newBanner] : [mutation.data.newBanner],
      );
    }
  }, [mutation.data, setBannerData]);

  async function handleCreateBanner(data: z.infer<typeof ZodHeroBannerSchema>) {
    mutation.mutate({ values: data, images: { image, imageSm } });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateBanner)}
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
          name="description"
          render={({ field }: { field: any }) => (
            <FormItem className="space-y-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }: { field: any }) => (
              <FormItem className="space-y-2">
                <FormLabel>Base Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R</span>
                    <Input
                      className="w-full pl-8"
                      type="number"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="offerPrice"
            render={({ field }: { field: any }) => (
              <FormItem className="space-y-2">
                <FormLabel>Offer Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R</span>
                    <Input
                      className="w-full pl-8"
                      type="number"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <div className="relative w-full space-y-2">
          <span className="flex items-center gap-1 text-sm font-medium text-zinc-500">
            <Info size={15} />
            Upload <b>Large</b> version of the Banner Image
          </span>
          {image ? (
            <>
              <Image src={image} alt="" className="aspect-video" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setImage("")}
                className="absolute -right-2 -top-2 z-10 h-8 w-8 p-0 rounded-full bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
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
              <Image src={imageSm} alt="" className="aspect-square" />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setImageSm("")}
                className="absolute -right-2 -top-2 z-10 h-8 w-8 p-0 rounded-full bg-white/10 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
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

export default NewBannerForm;
