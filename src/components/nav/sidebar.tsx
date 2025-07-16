"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import SubMenu from "./sub-menu";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  Menu,
  BookText,
  Boxes,
  BadgePercent,
  Wallet,
  BarChart3,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 912px)" });
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname, isTabletMid]);

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[48] max-h-screen bg-black/50 lg:hidden ${
          open ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="fixed z-[49] w-[16rem] max-w-[16rem] overflow-y-auto scrollbar-thin lg:relative border border-slate-300/60 dark:border-teal1/60 rounded-3xl m-3 h-[calc(100vh-1.5rem)] lg:m-4 lg:h-[calc(100vh-2rem)] transition-all duration-300 bg-white/100 dark:bg-zinc-900/100"
      >
        <div className="mx-4 flex items-center gap-3 py-6 border-b border-zinc-200/60 dark:border-teal1/40 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl blur-sm opacity-30"></div>
            <div className="relative bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
              <Image
                src="/logo.svg"
                className="flex-shrink-0 filter brightness-0 invert"
                alt="Mzansi Footwear Logo"
                width={20}
                height={20}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:via-zinc-100 dark:to-zinc-200 bg-clip-text text-transparent">
              Mzansi Footwear
            </span>
            <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              Admin Dashboard
            </span>
          </div>
        </div>

        <div className="flex h-full flex-col pb-8">
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-slate-200/80 dark:bg-zinc-800/30 text-slate-600 dark:text-zinc-400 group-hover:bg-slate-300/80 dark:group-hover:bg-zinc-700/50 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
                  }`}>
                    <LayoutDashboard size={16} />
                  </div>
                  <span className="font-semibold">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/orders"
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === "/dashboard/orders"
                      ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/orders"
                      ? "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-slate-200/80 dark:bg-zinc-800/30 text-slate-600 dark:text-zinc-400 group-hover:bg-slate-300/80 dark:group-hover:bg-zinc-700/50 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
                  }`}>
                    <Boxes size={16} />
                  </div>
                  <span className="font-semibold">Orders</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/revenue"
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === "/dashboard/revenue"
                      ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/revenue"
                      ? "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-slate-200/80 dark:bg-zinc-800/30 text-slate-600 dark:text-zinc-400 group-hover:bg-slate-300/80 dark:group-hover:bg-zinc-700/50 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
                  }`}>
                    <Wallet size={16} />
                  </div>
                  <span className="font-semibold">Revenue</span>
                </Link>
              </li>
              <SubMenu
                isOpen={open}
                data={{
                  name: "Catalog",
                  icon: BookText,
                  menus: [
                    { title: "Products", url: "/products" },
                    { title: "Categories", url: "/products/categories" },
                  ],
                }}
              />
              <SubMenu
                isOpen={open}
                data={{
                  name: "Customer details",
                  icon: Users,
                  menus: [
                    { title: "Customers", url: "/customers" },
                    { title: "Addresses", url: "/customers/addresses" },
                  ],
                }}
              />
              <li>
                <Link
                  href="/dashboard/offers"
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === "/dashboard/offers"
                      ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/offers"
                      ? "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-slate-200/80 dark:bg-zinc-800/30 text-slate-600 dark:text-zinc-400 group-hover:bg-slate-300/80 dark:group-hover:bg-zinc-700/50 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
                  }`}>
                    <BadgePercent size={16} />
                  </div>
                  <span className="font-semibold">Offers</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/site-traffic"
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === "/dashboard/site-traffic"
                      ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/site-traffic"
                      ? "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-slate-200/80 dark:bg-zinc-800/30 text-slate-600 dark:text-zinc-400 group-hover:bg-slate-300/80 dark:group-hover:bg-zinc-700/50 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
                  }`}>
                    <BarChart3 size={16} />
                  </div>
                  <span className="font-semibold">Analytics</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <motion.div
          onClick={() => {
            setOpen(!open);
          }}
          animate={
            open
              ? {
                  rotate: 0,
                }
              : {
                  rotate: 180,
                }
          }
          transition={{ duration: 0.2 }}
          className={`absolute bottom-4 ${
            open ? "right-4" : "right-5"
          } z-50 hidden h-fit w-fit cursor-pointer md:block`}
        >
          <div className="p-2 rounded-xl bg-white/80 dark:bg-zinc-800/60 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-700/40 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white dark:hover:bg-zinc-700/70">
            <ChevronLeft size={18} className="text-slate-600 dark:text-zinc-300 hover:text-slate-800 dark:hover:text-white" />
          </div>
        </motion.div>
      </motion.div>
      <div
        className="absolute top-4 z-20 m-4 cursor-pointer lg:hidden"
        onClick={() => setOpen(true)}
      >
        <div className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-700/40 shadow-lg">
          <Menu size={20} className="text-slate-600 dark:text-zinc-300" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
