import SignOutButton from "@/components/sign-out-button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import { LogOut, Shield, Clock, Lock, UserX, AlertTriangle } from "lucide-react";

const SignOut = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#124a4f] dark:via-[#0e3a3f] dark:to-[#071316] flex transition-all duration-300">
      {/* Left Side - Beautiful Design Elements */}
      <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.15),transparent_50%)]"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-3xl rotate-12 blur-sm"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-2xl -rotate-12 blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-red-400/30 to-orange-400/30 rounded-xl rotate-45"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12">
          {/* Brand Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-red-500 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative bg-gradient-to-r from-red-400 via-orange-400 to-red-500 p-4 rounded-2xl">
                  <Image
                    src="/logo.svg"
                    alt="Mzansi Footwear Logo"
                    width={48}
                    height={48}
                    className="filter brightness-0 invert"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                  Mzansi Footwear
                </h1>
                <p className="text-red-600 dark:text-red-400 font-medium">Session Management</p>
              </div>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold text-slate-800 dark:text-zinc-100 mb-4 leading-tight">
              Secure Session Management
            </h2>
            <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed mb-8">
              Your admin session is protected with enterprise-grade security.
              Sign out safely to ensure your business data remains secure.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 gap-4 mb-12">
            {[
              {
                icon: Shield,
                title: "Secure Authentication",
                desc: "Enterprise-grade session protection",
                color: "from-red-500 to-red-600",
                bg: "bg-red-500/10"
              },
              {
                icon: Lock,
                title: "Data Protection",
                desc: "Complete session data clearance",
                color: "from-orange-500 to-orange-600",
                bg: "bg-orange-500/10"
              },
              {
                icon: UserX,
                title: "Safe Sign Out",
                desc: "Secure session termination",
                color: "from-red-600 to-orange-600",
                bg: "bg-red-600/10"
              },
            ].map((feature, index) => (
              <div key={index} className={`p-4 rounded-xl ${feature.bg} border border-white/20 dark:border-zinc-700/40 backdrop-blur-sm`}>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3`}>
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Security Stats */}
          <div className="flex items-center gap-8">
            {[
              { icon: Shield, label: "Security Level", value: "High" },
              { icon: Clock, label: "Session Time", value: "Active" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
                  <stat.icon size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800 dark:text-zinc-200">{stat.value}</div>
                  <div className="text-xs text-slate-600 dark:text-zinc-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Signout Form */}
      <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/60 dark:border-zinc-700/40 shadow-2xl shadow-black/10 dark:shadow-black/30">
            <CardBody className="p-8">
              {/* Mobile Logo (only visible on small screens) */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-red-500 rounded-2xl blur-lg opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-red-400 via-orange-400 to-red-500 p-4 rounded-2xl">
                      <LogOut size={48} className="text-white" />
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent mb-2">
                  Sign Out
                </h1>
                <p className="text-slate-600 dark:text-zinc-400 text-sm">
                  Mzansi Footwear Admin
                </p>
              </div>

              {/* Session Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-zinc-200">Current Session</p>
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                      {session?.user?.email || "Administrator"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-zinc-200">Session Status</p>
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                      Active • Secure Connection
                    </p>
                  </div>
                </div>
              </div>

              {/* Signout Section */}
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">
                    End Your Session?
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    You&apos;re about to sign out of your admin dashboard.
                    You&apos;ll need to sign in again to access your operations.
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
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-zinc-700/40">
                <p className="text-xs text-center text-slate-500 dark:text-zinc-500">
                  Your session data will be securely cleared • Mzansi Footwear © 2024
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
