"use client";

import { Button } from "@nextui-org/button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useState } from "react";

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
      toast.success("Signed out successfully.");
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      color="danger"
      variant="solid"
      size="lg"
      className="w-full font-semibold"
      startContent={<LogOut size={18} />}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
};

export default SignOutButton;
