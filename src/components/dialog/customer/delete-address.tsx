import { useDeleteAddress } from "@/api-hooks/addresses/delete-address";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Tooltip,
  ModalFooter,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const DeleteAddress = ({
  id,
  children,
}: {
  id: number;
  children?: (onOpen: () => void) => React.ReactNode;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onSuccess = () => {
    toast.success("Address deleted successfully.");
    onClose();
  };

  // Delete address function
  const delete_mutation = useDeleteAddress(onSuccess);

  return (
    <>
      {children ? (
        children(onOpen)
      ) : (
        <Tooltip color="danger" content="Delete Address" showArrow>
          <Button
            onPress={onOpen}
            variant="light"
            radius="full"
            size="sm"
            color="danger"
            isIconOnly
          >
            <Trash2 size={20} />
          </Button>
        </Tooltip>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Delete Address?
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4">
                <p className="text-sm dark:text-zinc-400">
                  This action remove this address from database.
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

export default DeleteAddress;
