import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { ThemeSwitcher } from "../theme-switcher";
import User from "./user";
import Notification from "../sheets/notification";
import NavHeading from "./nav-heading";

const Nav = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="scrollbar-thin max-h-screen w-full md:overflow-y-scroll overflow-y-visible">
        <nav className="sticky top-0 z-10 flex w-full items-center justify-between px-6 py-2 bg-white/90 dark:bg-blackish/90 backdrop-blur-xl border-b border-zinc-200/60 dark:border-teal1/50 shadow-lg shadow-black/10 transition-all duration-300 rounded-bl-2xl rounded-br-2xl">
          <div className="flex items-center">
            <NavHeading />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20">
                <span className="text-xs font-medium text-emerald-400">
                  Admin Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="p-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-zinc-800/50 transition-colors">
                <Notification />
              </div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-zinc-800/50 transition-colors">
                <ThemeSwitcher />
              </div>
              <div className="ml-1">
                <User />
              </div>
            </div>
          </div>
        </nav>
        <main className="mx-auto min-h-[calc(100vh_-_80px)] max-w-7xl flex-1 px-6 py-6 bg-slate-50/30 dark:bg-transparent transition-all duration-300">
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Nav;
