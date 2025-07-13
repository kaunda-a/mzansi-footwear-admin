import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

type DataProps = {
  name: string;
  icon: LucideIcon;
  menus: { title: string; url: string }[];
};

function findActivePathname(data: DataProps, pathname: string) {
  if (data.menus.find((menu) => pathname.includes(menu.url))) {
    return true;
  }
  return false;
}

const SubMenu = ({
  data,
  isOpen,
}: {
  data: {
    name: string;
    icon: LucideIcon;
    menus: { title: string; url: string }[];
  };
  isOpen: boolean;
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <button
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 w-full ${
          findActivePathname(data, pathname)
            ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30"
            : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white"
        }`}
        onClick={() => setSubMenuOpen(!subMenuOpen)}
      >
        <div className={`p-1.5 rounded-lg transition-colors ${
          findActivePathname(data, pathname)
            ? "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg shadow-emerald-500/20"
            : "bg-slate-200/80 dark:bg-zinc-800/30 text-slate-600 dark:text-zinc-400 group-hover:bg-slate-300/80 dark:group-hover:bg-zinc-700/50 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
        }`}>
          <data.icon size={16} />
        </div>
        <span className="flex-1 text-left font-semibold">{data.name}</span>
        <ChevronDown
          size={16}
          className={`${subMenuOpen && "rotate-180"} duration-200 transition-transform`}
        />
      </button>
      <motion.ul
        animate={
          subMenuOpen
            ? {
                height: "fit-content",
              }
            : {
                height: 0,
              }
        }
        className="flex h-0 flex-col overflow-hidden pl-14 text-sm font-normal"
      >
        {data.menus?.map((menu) => (
          <li key={menu.title}>
            <Link
              href={`/dashboard${menu.url}`}
              className="flex cursor-default items-center gap-7 rounded-md !bg-transparent p-2 font-medium capitalize text-zinc-500 duration-300 hover:text-primary dark:text-zinc-400 md:cursor-pointer"
            >
              {menu.title}
            </Link>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default SubMenu;
