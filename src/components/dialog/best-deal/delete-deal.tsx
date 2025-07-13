import { useDeleteDeal } from "@/api-hooks/best-deals/delete-deal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
import { BestDeal } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const DeleteDeal = ({
  id,
  setDealData,
}: {
  id: number;
  setDealData: Dispatch<SetStateAction<BestDeal | null>>;
}) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const onSuccess = () => {
    toast.success("Deal deleted successfully.");
    onClose();
    setDealData(null);
  };

  // Delete DEAL function
  const delete_mutation = useDeleteDeal(onSuccess);

  return (
    <>
      <Button
        startContent={<Trash2 size={19} />}
        onPress={onOpen}
        size="sm"
        isIconOnly
        variant="light"
        radius="full"
        color="danger"
        className="bg-white/10 dark:bg-zinc-800/30 border border-slate-200/60 dark:border-zinc-700/40 shadow-sm hover:shadow-md transition-all duration-200"
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Delete Deal?
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4">
                <p className="text-sm dark:text-zinc-400">
                  This action remove this deal from database.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => delete_mutation.mutate(id)}
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

export default DeleteDeal;
