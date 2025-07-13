import { Ban, X } from "lucide-react";
import { AddColorSectionProps } from "@/lib/types/types";
import { useGlobalContext } from "@/context/store";
import { capitalizeSearchParam } from "@/lib/utils";
import { Button, Tooltip, Input } from "@nextui-org/react";

const AddColorSection = ({
  variant,
  index,
  form,
  setDisable,
}: AddColorSectionProps) => {
  const { colorVariants, setColorVariants } = useGlobalContext();

  function addColor(color: string, index: number) {
    if (index === 0 && color.toLowerCase() === "default") setDisable(true);
    else setDisable(false);

    setColorVariants((prevVariant) =>
      prevVariant.map((value, i) =>
        i === index
          ? { ...value, color: capitalizeSearchParam(color)! }
          : value,
      ),
    );
  }

  function removeColorSection(index: number) {
    setColorVariants((prevVariant) =>
      prevVariant.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-sm">
          Color {index + 1}:{" "}
          {index === 0 && (
            <span className="text-xs text-gray-400">
              &#40;Type &apos;default&apos; if there is only a single color
              variant!&#41;
            </span>
          )}
        </h1>
        <button type="button" onClick={() => removeColorSection(index)}>
          <X size={20} />
        </button>
      </div>
      <div className="flex items-center gap-5">
        <Input
          placeholder="Enter color"
          variant="bordered"
          radius="lg"
          size="sm"
          className="mb-4 mt-2"
          value={colorVariants[index].color}
          onValueChange={(value) => addColor(value, index)}
          classNames={{
            label: "font-medium z-0",
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
      </div>
    </div>
  );
};

export default AddColorSection;
