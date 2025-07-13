"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { MarqueeOffers } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import EditOfferForm from "@/components/forms/marquee-offers/edit-offer-form";
import { Pencil } from "lucide-react";

export default function EditMarqueeOffer({
  offer,
  setOffersData,
}: {
  offer: MarqueeOffers;
  setOffersData: Dispatch<SetStateAction<MarqueeOffers[] | null>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          onPress={onOpen}
          className="bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Pencil className="text-zinc-500" size={20} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Add new offer
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4 scrollbar-thin max-h-[400px] overflow-y-scroll">
                <EditOfferForm
                  offer={offer}
                  onClose={onClose}
                  setOffersData={setOffersData}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
