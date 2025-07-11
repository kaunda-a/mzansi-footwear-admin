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
        className="fixed z-[49] h-screen w-[16rem] max-w-[16rem] overflow-hidden lg:relative"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 16px 32px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.05)'
        }}
        className="dark:bg-gradient-to-b dark:from-slate-900/95 dark:to-slate-800/95 dark:border-r dark:border-slate-700/50 dark:shadow-2xl"
      >
        <div className="mx-4 flex items-center gap-3 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Image
                src="/mzansi-footwear-logo.svg"
                className="flex-shrink-0 filter brightness-0 invert"
                alt="Mzansi Footwear Logo"
                width={24}
                height={24}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Mzansi Footwear
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm"
                      : "bg-slate-200/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/50"
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
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/orders"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm"
                      : "bg-slate-200/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/50"
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
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/revenue"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm"
                      : "bg-slate-200/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/50"
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
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/offers"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm"
                      : "bg-slate-200/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/50"
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
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    pathname === "/dashboard/site-traffic"
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm"
                      : "bg-slate-200/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/50"
                  }`}>
                    <BarChart3 size={16} />
                  </div>
                  <span className="font-semibold">Analytics</span>
                </Link>
              </li>
            </ul>
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
          <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white dark:hover:bg-slate-800">
            <ChevronLeft size={18} className="text-slate-600 dark:text-slate-400" />
          </div>
        </motion.div>
      </motion.div>
      <div
        className="absolute top-4 z-20 m-4 cursor-pointer lg:hidden"
        onClick={() => setOpen(true)}
      >
        <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <Menu size={20} className="text-slate-600 dark:text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
