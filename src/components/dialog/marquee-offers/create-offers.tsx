"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import NewOfferForm from "@/components/forms/marquee-offers/new-offer-form";
import { MarqueeOffers } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export default function CreateOffers({
  setOffersData,
}: {
  setOffersData: Dispatch<SetStateAction<MarqueeOffers[] | null>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        startContent={<Plus size={15} />}
        size="sm"
        color="primary"
      >
        Add Offer
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Add new offer
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4 scrollbar-thin max-h-[400px] overflow-y-scroll">
                <NewOfferForm onClose={onClose} setOffersData={setOffersData} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
