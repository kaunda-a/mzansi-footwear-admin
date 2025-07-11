"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ZodAuthSchema } from "@/lib/zod-schemas/schema";
import { motion as m } from "framer-motion";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

function AuthForm() {
  const [isPassword, setIsPassword] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signInLoading, setSignInIsLoading] = useState(false);
  const router = useRouter();
  const callback = useSearchParams();

  const form = useForm<z.infer<typeof ZodAuthSchema>>({
    resolver: zodResolver(ZodAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(data: z.infer<typeof ZodAuthSchema>) {
    setError(null);
    setSignInIsLoading(true);

    try {
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callback.get("callbackUrl") || "/dashboard",
      });

      if (signInResponse?.error) {
        form.reset();
        throw new Error("Invalid credentials.");
      }
      toast.success("Signed in successfully. redirecting...");
      router.refresh();
      router.replace(signInResponse?.url || "/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSignInIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Input
                  placeholder="Administrator Email"
                  {...field}
                  size="lg"
                  variant="bordered"
                  classNames={{
                    input: "text-base",
                    inputWrapper: "border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 focus-within:border-emerald-500 dark:focus-within:border-emerald-400"
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Administrator Password"
                  size="lg"
                  variant="bordered"
                  autoComplete="current-password"
                  classNames={{
                    input: "text-base",
                    inputWrapper: "border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 focus-within:border-emerald-500 dark:focus-within:border-emerald-400"
                  }}
                  endContent={
                    isPassword ? (
                      <Eye
                        className="h-5 w-5 cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                        onClick={() => setIsPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        className="h-5 w-5 cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                        onClick={() => setIsPassword(true)}
                      />
                    )
                  }
                  type={isPassword ? "password" : "text"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error ? (
          <m.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
            }}
            className="mt-3 block h-5 text-center text-xs font-medium text-destructive dark:text-red-500"
          >
            {error}
          </m.span>
        ) : (
          <span className="mt-3 block h-5" />
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            isLoading={signInLoading}
            color="primary"
            isDisabled={signInLoading}
            size="lg"
            className="w-full font-semibold bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            type="submit"
          >
            {signInLoading ? "Signing in..." : "Sign in to Dashboard"}
          </Button>
          <Button
            color="primary"
            isDisabled={signInLoading}
            size="lg"
            className="w-full font-medium"
            onClick={() =>
              handleSignIn({
                email: "guest1212@gmail.com",
                password: "guest1212",
              })
            }
            variant="bordered"
            type="button"
          >
            Continue as Guest
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default AuthForm;
