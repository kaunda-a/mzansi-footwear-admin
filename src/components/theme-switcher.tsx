"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {theme === "dark" ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("light")}
          className="h-8 w-8 p-0 rounded-full hover:bg-slate-100/80 dark:hover:bg-zinc-800/50"
        >
          <Sun className="h-4 w-4 text-zinc-400" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("dark")}
          className="h-8 w-8 p-0 rounded-full hover:bg-slate-100/80 dark:hover:bg-zinc-800/50"
        >
          <Moon className="h-4 w-4 text-zinc-500" />
        </Button>
      )}
    </div>
  );
}
