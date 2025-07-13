"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { Pencil } from "lucide-react";
import { Category } from "@/lib/types/types";
import EditCategoryForm from "@/components/forms/edit-category";

const EditCategory = ({ category }: { category: Category }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip content="Edit category" showArrow>
        <Button
          onPress={onOpen}
          variant="light"
          radius="full"
          size="sm"
          isIconOnly
          className="text-default-400 active:opacity-50 bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Pencil size={20} />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Edit Category
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4">
                <EditCategoryForm category={category} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditCategory;
