import SignOutButton from "@/components/sign-out-button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import { LogOut, Shield, Clock } from "lucide-react";

const SignOut = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#124a4f] dark:via-[#0e3a3f] dark:to-[#071316] flex items-center justify-center p-4 transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-700/40 shadow-2xl shadow-black/10 dark:shadow-black/30">
          <CardBody className="p-8 space-y-8">
            {/* Logo and Branding */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-red-500 rounded-2xl blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-red-400 via-orange-400 to-red-500 p-4 rounded-2xl">
                    <LogOut size={48} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                  Sign Out
                </h1>
                <p className="text-lg font-medium text-slate-600 dark:text-zinc-400">
                  Mzansi Footwear Admin
                </p>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Shield size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    Signed in as
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {session?.user?.email || "Administrator"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    Session Active
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Your admin session is currently active
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="text-center space-y-3">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-200">
                End Your Session?
              </h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                You&apos;re about to sign out of your Mzansi Footwear admin dashboard.
                You&apos;ll need to sign in again to access your business operations.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <SignOutButton />
              <div className="text-center">
                <a
                  href="/dashboard"
                  className="text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                >
                  Return to Dashboard
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-200/60 dark:border-zinc-700/40">
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Your session data will be securely cleared
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SignOut;
