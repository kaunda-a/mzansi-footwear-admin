import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import AddColorSection from "@/components/forms/products/components/add-color-section";
import { useGlobalContext } from "@/context/store";
import { ProductFormProps } from "@/lib/types/types";

const AddColorDialog = ({ form, setDisable }: ProductFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { colorVariants, setColorVariants } = useGlobalContext();

  function addColorSection() {
    setColorVariants((prevVariant) => [
      ...prevVariant,
      { color: "", thumbnail: "", others: [] },
    ]);
  }

  return (
    <>
      <Button
        isIconOnly
        type="button"
        onClick={() => {
          onOpen();
          addColorSection();
        }}
        className="bg-white/80 dark:bg-zinc-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-zinc-700/40 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white dark:hover:bg-zinc-700/70"
      >
        <Plus />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Add new color
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4">
                {colorVariants.map((variant, i) => (
                  <AddColorSection
                    form={form}
                    index={i}
                    variant={variant}
                    setDisable={setDisable}
                    key={i}
                  />
                ))}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddColorDialog;
