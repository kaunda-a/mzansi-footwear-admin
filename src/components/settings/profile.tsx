'use client'

import { Avatar, Badge, Image } from "@nextui-org/react";
import { Session } from "next-auth";
import EditProfile from "../dialog/edit-profile";
import { useSession } from "next-auth/react";

const Profile = ({ session }: { session: Session | null }) => {
  const { data, update } = useSession();

  return (
    <>
      <h1 className="mb-3 text-xl font-medium text-zinc-400">Profile</h1>
      <div className="flex rounded-xl bg-white p-5 shadow-md dark:bg-dark">
        <Badge
          content=""
          color="success"
          shape="circle"
          placement="bottom-right"
          classNames={{
            badge: "right-4",
          }}
        >
          <Avatar
            radius="full"
            className="h-20 w-20 text-large"
            showFallback
            classNames={{
              fallback: "w-full h-full",
            }}
            fallback={<Image src="/avatar.jpg" alt="avatar" radius="full" />}
            src={data?.user.image || session?.user.image || ""}
          />
        </Badge>
        <div className="ms-3 space-y-1.5">
          <h1 className="text-lg font-semibold">
            {data?.user.name || session?.user.name}
          </h1>
          <p className="text-xs text-zinc-400">
            Role:{" "}
            <span className="font-medium text-success">
              {data?.user.role || session?.user.role}
            </span>
          </p>
          <p className="text-xs text-zinc-400">
            Email:{" "}
            <span className="font-medium text-black dark:text-white">
              {data?.user.email || session?.user.email}
            </span>
          </p>
        </div>
        <EditProfile update={update} />
      </div>
    </>
  );
};

export default Profile;
