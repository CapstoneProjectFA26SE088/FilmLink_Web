"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") return;
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") return null;

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    try {
      window.localStorage.setItem("filmlink-theme", nextTheme);
    } catch {
      // The visual preference still applies for this session if storage is unavailable.
    }
    setTheme(nextTheme);
  }

  const label = theme === "light" ? "Bật giao diện tối" : "Bật giao diện sáng";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="fixed right-4 top-4 z-50 inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-10"
    >
      {theme === "light" ? (
        <MoonIcon aria-hidden="true" className="size-4" />
      ) : (
        <SunIcon aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
