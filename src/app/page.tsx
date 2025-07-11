import AuthForm from "@/components/forms/auth-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

const SignIn = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#124a4f] dark:via-[#0e3a3f] dark:to-[#071316] flex items-center justify-center p-4 transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-700/40 shadow-2xl shadow-black/10 dark:shadow-black/30">
          <CardBody className="p-8 space-y-8">
            {/* Logo and Branding */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 p-4 rounded-2xl">
                    <Image
                      src="/logo.svg"
                      alt="Mzansi Footwear Logo"
                      width={48}
                      height={48}
                      className="filter brightness-0 invert"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                  Mzansi Footwear
                </h1>
                <p className="text-lg font-medium text-slate-600 dark:text-zinc-400">
                  Admin Dashboard
                </p>
                <p className="text-sm text-slate-500 dark:text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Manage your South African footwear empire with precision and style. Access your comprehensive business analytics and operations center.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-medium">
                  Administrator Access
                </span>
              </div>
            </div>

            {/* Auth Form */}
            <div className="space-y-6">
              <AuthForm />
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-200/60 dark:border-zinc-700/40">
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Secure access to your business operations
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
