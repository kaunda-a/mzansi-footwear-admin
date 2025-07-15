import { Ban, X } from "lucide-react";
import { AddColorSectionProps } from "@/lib/types/types";
import { useGlobalContext } from "@/context/store";
import { capitalizeSearchParam } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeColorSection(index)}
              >
                <X size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove color section</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-5">
        <Input
          placeholder="Enter color"
          className="mb-4 mt-2"
          value={colorVariants[index].color}
          onChange={(e) => addColor(e.target.value, index)}
        />
      </div>
    </div>
  );
};

export default AddColorSection;
