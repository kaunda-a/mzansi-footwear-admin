import React, { Dispatch, SetStateAction } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import EditDealForm from "@/components/forms/best-deal/edit-deal-form";
import { Pencil } from "lucide-react";
import { BestDeal } from "@prisma/client";

export default function EditDeal({
  data,
  setDealData,
}: {
  data: BestDeal;
  setDealData: Dispatch<SetStateAction<BestDeal | null>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        startContent={<Pencil size={19} />}
        size="sm"
        color="primary"
        variant="light"
        radius="full"
        isIconOnly
        className="bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Edit Deal
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4 scrollbar-thin max-h-[400px] overflow-y-scroll">
                <EditDealForm
                  deal={data}
                  onClose={onClose}
                  setDealData={setDealData}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
