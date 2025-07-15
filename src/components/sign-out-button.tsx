"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";
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
    } catch (error: any) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="destructive"
      size="lg"
      className="w-full font-semibold"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="mr-2 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut size={18} className="mr-2" />
          Sign Out
        </>
      )}
    </Button>
  );
};

export default SignOutButton;
