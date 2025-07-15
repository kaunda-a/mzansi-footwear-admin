"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#124a4f] dark:via-[#0e3a3f] dark:to-[#071316] flex items-center justify-center p-4 transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      <div className="relative z-10 w-full max-w-lg">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-700/40 shadow-2xl shadow-black/10 dark:shadow-black/30">
          <CardContent className="p-8 text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 p-4 rounded-2xl">
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

            {/* 404 Animation */}
            <div className="space-y-4">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent animate-bounce">
                404
              </h1>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-200">
                  Page Not Found
                </h2>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Oops! The page you&apos;re looking for seems to have wandered off.
                  Let&apos;s get you back to your Mzansi Footwear dashboard.
                </p>
              </div>
            </div>

            {/* Search Suggestion */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Search size={16} className="text-slate-500 dark:text-zinc-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-zinc-300">
                  What were you looking for?
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Try navigating back to the dashboard or check the URL for typos
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="flex-1 font-semibold bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white flex items-center gap-2"
              >
                <Link href="/dashboard">
                  <Home size={18} />
                  Go to Dashboard
                </Link>
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                size="lg"
                className="flex-1 font-medium flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Go Back
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-zinc-700/40">
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Mzansi Footwear Admin Dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
