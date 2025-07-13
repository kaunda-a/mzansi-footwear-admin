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
import { HeroBanner } from "@prisma/client";
import NewBannerForm from "@/components/forms/hero-banner/new-banner-form";

export default function AddBanner({
  setBannerData,
}: {
  setBannerData: Dispatch<SetStateAction<HeroBanner[] | null>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        size="sm"
        endContent={<Plus size={20} />}
        onPress={onOpen}
      >
        Add New
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Add New Banner
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4 scrollbar-thin max-h-[400px] overflow-y-scroll">
                <NewBannerForm
                  onClose={onClose}
                  setBannerData={setBannerData}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
