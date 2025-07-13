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
import EditAdminForm from "../../forms/edit-admin-form";
import { Pencil } from "lucide-react";
import { AdminProps } from "@/lib/types/types";

const EditAdmin = ({ admin }: { admin: AdminProps }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Tooltip content="Edit admin" showArrow>
        <Button
          onPress={onOpen}
          variant="light"
          radius="full"
          size="sm"
          isIconOnly
          className="text-default-400 active:opacity-50"
        >
          <Pencil size={20} />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                Edit Admin
              </ModalHeader>
              <ModalBody className="mb-5 px-6 py-4">
                <EditAdminForm onClose={onClose} admin={admin} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditAdmin;
