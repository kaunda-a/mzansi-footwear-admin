import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-100/95 dark:from-[#124a4f]/95 dark:via-[#0e3a3f]/95 dark:to-[#071316]/95 backdrop-blur-sm transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>

      <Card className="relative backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-700/40 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-3xl">
        <CardContent className="p-8 flex flex-col items-center space-y-6">
          {/* Animated Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 p-4 rounded-2xl animate-pulse">
              <Image
                src="/logo.svg"
                alt="Mzansi Footwear Logo"
                width={48}
                height={48}
                className="filter brightness-0 invert"
              />
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full blur-md opacity-20 animate-spin"></div>
            <Loader2 className="relative animate-spin text-emerald-500 dark:text-emerald-400" size={32} />
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-100 dark:to-white bg-clip-text text-transparent">
              Mzansi Footwear
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 animate-pulse">
              Loading your dashboard...
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;
