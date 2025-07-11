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
        <nav className="sticky top-0 z-10 flex w-full items-center justify-between px-6 py-3 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg shadow-black/10">
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
              <div className="p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors">
                <Notification />
              </div>
              <div className="p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors">
                <ThemeSwitcher />
              </div>
              <div className="ml-1">
                <User />
              </div>
            </div>
          </div>
        </nav>
        <main className="mx-auto min-h-[calc(100vh_-_80px)] max-w-7xl flex-1 px-6 py-6 bg-zinc-950/30">
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Nav;
