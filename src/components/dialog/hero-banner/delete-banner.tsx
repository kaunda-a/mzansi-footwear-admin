import { useDeleteBanner } from "@/api-hooks/hero-banners/delete-banner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
import { HeroBanner } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const DeleteHeroBanner = ({
  id,
  setBannerData,
  publicId,
}: {
  id: number;
  setBannerData: Dispatch<SetStateAction<HeroBanner[] | null>>;
  publicId: string;
}) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const onSuccess = () => {
    toast.success("Banner deleted successfully.");
    onClose();
    setBannerData((prev) =>
      prev ? prev.filter((banner) => banner.id !== id) : null,
    );
  };

  // Delete BANNER function
  const delete_mutation = useDeleteBanner(onSuccess);

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        size="sm"
        variant="light"
        radius="full"
        className="bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Trash2 className="text-danger" size={20} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Delete Banner?
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4">
                <p className="text-sm dark:text-zinc-400">
                  This action remove this banner from database.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => delete_mutation.mutate({ id, publicId })}
                  isLoading={delete_mutation.isPending}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteHeroBanner;
