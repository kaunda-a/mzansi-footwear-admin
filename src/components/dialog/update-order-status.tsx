"use client";

import { useUpdateOrderStatus } from "@/api-hooks/orders/update-status";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";

const UpdateOrderStatus = ({
  oid,
  status,
  setStatus,
}: {
  oid: string;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  function onSuccess() {
    onClose();
    setStatus(status === "pending" ? "ongoing" : "delivered");
  }

  const mutation = useUpdateOrderStatus(onSuccess);

  return (
    <>
      <Button
        onPress={onOpen}
        size="sm"
        color="primary"
        isDisabled={status === "delivered"}
      >
        Update status
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Update Status
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4">
                <p className="text-sm text-zinc-500">
                  Are you want to update the order status from{" "}
                  <b className="font-medium text-[#46D483]">
                    {status === "pending"
                      ? "Order Placed"
                      : "Packed & Shipping"}
                  </b>{" "}
                  to{" "}
                  <b className="font-medium text-[#46D483]">
                    {status === "pending" ? "Packed & Shipping" : "Delivered"}
                  </b>{" "}
                  ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isLoading={mutation.isPending}
                  onClick={() =>
                    mutation.mutate({
                      id: oid,
                      status: status === "pending" ? "ongoing" : "delivered",
                    })
                  }
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateOrderStatus;
