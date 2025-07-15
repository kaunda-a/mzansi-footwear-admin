import AuthForm from "@/components/forms/auth-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Shield, BarChart3, Users, Package, TrendingUp, Globe, Award, Zap } from "lucide-react";

const SignIn = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#124a4f] dark:via-[#0e3a3f] dark:to-[#071316] flex transition-all duration-300">
      {/* Left Side - Beautiful Design Elements */}
      <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.15),transparent_50%)]"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-3xl rotate-12 blur-sm"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl -rotate-12 blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-xl rotate-45"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12">
          {/* Brand Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-40"></div>
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
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
                  Mzansi Footwear
                </h1>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">Admin Dashboard</p>
              </div>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold text-slate-800 dark:text-zinc-100 mb-4 leading-tight">
              Manage Your South African Footwear Empire
            </h2>
            <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed mb-8">
              Comprehensive business analytics, inventory management, and customer insights
              all in one powerful platform designed for the South African market.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                desc: "Real-time insights & reports",
                color: "from-emerald-500 to-emerald-600",
                bg: "bg-emerald-500/10"
              },
              {
                icon: Users,
                title: "Customer Management",
                desc: "Track & engage customers",
                color: "from-cyan-500 to-cyan-600",
                bg: "bg-cyan-500/10"
              },
              {
                icon: Package,
                title: "Inventory Control",
                desc: "Smart stock management",
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-500/10"
              },
              {
                icon: TrendingUp,
                title: "Sales Growth",
                desc: "Boost revenue & profits",
                color: "from-purple-500 to-purple-600",
                bg: "bg-purple-500/10"
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

          {/* Stats */}
          <div className="flex items-center gap-8">
            {[
              { icon: Globe, label: "South African Market Leader", value: "#1" },
              { icon: Award, label: "Customer Satisfaction", value: "98%" },
              { icon: Zap, label: "Faster Operations", value: "3x" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/60 dark:border-zinc-700/40 shadow-2xl shadow-black/10 dark:shadow-black/30">
            <CardContent className="p-8">
              {/* Mobile Logo (only visible on small screens) */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex justify-center mb-4">
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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent mb-2">
                  Mzansi Footwear
                </h1>
                <p className="text-slate-600 dark:text-zinc-400 text-sm">
                  Admin Dashboard
                </p>
              </div>

              {/* Welcome Text */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-200 mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-600 dark:text-zinc-400">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Auth Form */}
              <AuthForm />

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-zinc-700/40">
                <p className="text-xs text-center text-slate-500 dark:text-zinc-500">
                  Secure admin access • Mzansi Footwear © 2024
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
