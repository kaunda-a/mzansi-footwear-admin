import ImagePreview from "@/components/forms/products/components/image-preview";
import { useGlobalContext } from "@/context/store";
import { ImagePickerProps } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";

const ImagePicker = ({ action, variant, variantIndex }: ImagePickerProps) => {
  const { setColorVariants } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
          const binaryStr = reader.result;
          if (action === "thumbnail") {
            setColorVariants((prevVariant) =>
              prevVariant.map((value, i) => ({
                ...value,
                thumbnail:
                  i === variantIndex && typeof binaryStr === "string"
                    ? binaryStr
                    : value.thumbnail,
              })),
            );
          } else {
            setColorVariants((prevVariant) =>
              prevVariant.map((value, i) => ({
                ...value,
                others:
                  i === variantIndex
                    ? [
                        ...value.others,
                        typeof binaryStr === "string" ? binaryStr : "",
                      ]
                    : value.others,
              })),
            );
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [action, setColorVariants, variantIndex],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[rgba(0,111,238,0.15)] text-[#006FEE] h-8 w-8 p-0"
          variant="outline"
          type="button"
        >
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/60 dark:border-zinc-700/60 shadow-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
            Upload Product Images
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
                <Dropzone
                  onDrop={onDrop}
                  accept={{
                    "image/jpeg": [],
                    "image/png": [],
                    "image/webp": [],
                  }}
                  multiple={action !== "thumbnail"}
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                      className={`${
                        isDragActive ? "border-blue-500" : "border-gray-300"
                      } h-28 w-full rounded-lg border-2 border-dashed bg-gray-100 dark:bg-zinc-800/50`}
                    >
                      <div
                        {...getRootProps({
                          className:
                            "flex h-full items-center justify-center p-5 text-center",
                          onDrop: (event) => event.stopPropagation(),
                        })}
                      >
                        <input {...getInputProps()} />
                        <div className="flex h-full cursor-default items-center justify-center p-5 text-center">
                          {isDragActive ? (
                            <p>Drop the files here ...</p>
                          ) : (
                            <p>
                              Drag &apos;n&apos; drop images here, or click to
                              select files
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Dropzone>
                {action === "others" && (
                  <div className="flex h-20 w-full gap-3 overflow-x-scroll scrollbar-hide">
                    {variant.others.map((image, i) => (
                      <ImagePreview
                        image={image}
                        imageIndex={i}
                        action="others"
                        variantIndex={variantIndex}
                        key={i}
                      />
                    ))}
                  </div>
                )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePicker;
