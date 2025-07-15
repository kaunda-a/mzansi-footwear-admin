'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EditProfile from "../dialog/edit-profile";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Profile = () => {
  const { data, update } = useSession();

  return (
    <>
      <h1 className="mb-3 text-xl font-medium text-zinc-400">Profile</h1>
      <div className="flex rounded-xl bg-white p-5 shadow-md dark:bg-dark">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={data?.user.image || ""} alt={data?.user.name || "User"} />
            <AvatarFallback className="w-full h-full">
              <Image
                src="/avatar.jpg"
                alt="avatar"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-dark"></div>
        </div>
        <div className="ms-3 space-y-1.5">
          <h1 className="text-lg font-semibold">
            {data?.user.name}
          </h1>
          <p className="text-xs text-zinc-400">
            Role:{" "}
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {data?.user.role}
            </Badge>
          </p>
          <p className="text-xs text-zinc-400">
            Email:{" "}
            <span className="font-medium text-black dark:text-white">
              {data?.user.email}
            </span>
          </p>
        </div>
        <EditProfile update={update} />
      </div>
    </>
  );
};

export default Profile;
