import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ProductFormProps } from "@/lib/types/types";
import { Button, Input } from "@nextui-org/react";
import AddColorDialog from "@/components/dialog/products/add-color-dialog";
import AddColorSection from "./add-color-section";
import { useGlobalContext } from "@/context/store";

const ProductOptions = ({ form }: ProductFormProps) => {
  const { colorVariants, setColorVariants } = useGlobalContext();
  const [disable, setDisable] = useState(false);

  return (
    <div className="flex-1 p-5 ps-3">
      <div className="mb-3 flex w-full items-center justify-between">
        <p className="font-medium">Color</p>
        <AddColorDialog form={form} setDisable={setDisable} />
      </div>
      <hr />
      <div>
        {colorVariants.map((variant, i) => (
          <AddColorSection
            form={form}
            index={i}
            variant={variant}
            setDisable={setDisable}
            key={i}
          />
        ))}
      </div>
      <hr />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {(["variantName", "variantValues"] as const).map((item, i) => (
          <FormField
            key={i}
            control={form.control}
            name={item}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    label={item.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    labelPlacement="outside"
                    placeholder={`${item.replace(
                      /([a-z])([A-Z])/g,
                      "$1 $2",
                    )} (optional)`}
                    variant="bordered"
                    radius="lg"
                    classNames={{
                      label: "font-medium capitalize z-0",
                      input: "placeholder:capitalize",
                      inputWrapper: [
                        "border-2",
                        "border-slate-200/60",
                        "bg-transparent",
                        "dark:border-zinc-700/40",
                        "group-data-[focus=true]:border-blue-500/60",
                        "dark:group-data-[focus=true]:border-blue-500/60",
                        "group-data-[hover=true]:border-slate-300",
                        "dark:group-data-[hover=true]:border-zinc-600",
                      ],
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                label="Keywords"
                labelPlacement="outside"
                placeholder="Keywords"
                variant="bordered"
                radius="lg"
                classNames={{
                  label: "font-medium capitalize",
                  inputWrapper: [
                    "border-2",
                    "border-slate-200/60",
                    "bg-transparent",
                    "dark:border-zinc-700/40",
                    "group-data-[focus=true]:border-blue-500/60",
                    "dark:group-data-[focus=true]:border-blue-500/60",
                    "group-data-[hover=true]:border-slate-300",
                    "dark:group-data-[hover=true]:border-zinc-600",
                    "mt-3",
                  ],
                  input: "placeholder:capitalize",
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductOptions;
