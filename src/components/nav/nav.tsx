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
      <div className="scrollbar-thin max-h-screen w-full overflow-y-scroll">
        <nav className="sticky top-0 z-10 flex w-full items-center justify-between px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center">
            <NavHeading />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-500/20">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Admin Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="p-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                <Notification />
              </div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                <ThemeSwitcher />
              </div>
              <div className="ml-1">
                <User />
              </div>
            </div>
          </div>
        </nav>
        <main className="mx-auto min-h-[calc(100vh_-_80px)] max-w-7xl flex-1 px-6 py-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Nav;
