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
      <Popover
        placement="right"
        showArrow={true}
        classNames={{
          base: "before:dark:bg-zinc-800 before:z-10 before:shadow-none",
        }}
      >
        <PopoverTrigger>
          <button
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 w-full ${
              findActivePathname(data, pathname)
                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-500/20"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => isOpen && setSubMenuOpen(!subMenuOpen)}
          >
            <div className={`p-1.5 rounded-lg transition-colors ${
              findActivePathname(data, pathname)
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm"
                : "bg-slate-200/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300/80 dark:group-hover:bg-slate-600/50"
            }`}>
              <data.icon size={16} />
            </div>
            <span className="flex-1 text-left font-semibold">{data.name}</span>
            <ChevronDown
              size={16}
              className={`${subMenuOpen && "rotate-180"} duration-200 transition-transform`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          hidden={isOpen}
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-2xl p-2"
        >
          <ul className="min-w-[200px] space-y-1">
            {data.menus.map((menu, i) => (
              <li key={i}>
                <Link
                  href={`/dashboard${menu.url}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
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
