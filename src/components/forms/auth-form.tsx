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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormFieldRenderProps } from "@/types/react-components";

type FormData = z.infer<typeof ZodAuthSchema>;

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
          render={({ field }: FormFieldRenderProps<FormData, "email">) => (
            <FormItem className="mb-4">
              <FormControl>
                <Input
                  placeholder="Administrator Email"
                  type="email"
                  {...field}
                  className="h-12 text-base border-2 border-border hover:border-border/80 focus-visible:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: FormFieldRenderProps<FormData, "password">) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Administrator Password"
                    type={isPassword ? "password" : "text"}
                    autoComplete="current-password"
                    className="h-12 text-base border-2 border-border hover:border-border/80 focus-visible:border-primary pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsPassword(!isPassword)}
                  >
                    {isPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
            disabled={signInLoading}
            className="w-full h-12 font-semibold bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            type="submit"
          >
            {signInLoading ? "Signing in..." : "Sign in to Dashboard"}
          </Button>
          <Button
            disabled={signInLoading}
            variant="outline"
            className="w-full h-12 font-medium"
            type="button"
            onClick={() =>
              handleSignIn({
                email: "guest1212@gmail.com",
                password: "guest1212",
              })
            }
          >
            Continue as Guest
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default AuthForm;
