import React, { Dispatch, SetStateAction } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { BestDeal } from "@prisma/client";
import NewDealForm from "@/components/forms/best-deal/new-deal-form";

export default function AddNewDeal({
  setDealData,
}: {
  setDealData: Dispatch<SetStateAction<BestDeal | null>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        size="lg"
        radius="full"
        isIconOnly
        color="primary"
        variant="flat"
      >
        <Plus />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Add New Deal
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4 scrollbar-thin max-h-[400px] overflow-y-scroll">
                <NewDealForm onClose={onClose} setDealData={setDealData} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
