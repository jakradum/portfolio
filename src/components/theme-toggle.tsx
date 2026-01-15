"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      className="relative h-6 w-12 border border-border bg-background transition-colors hover:border-foreground"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="absolute top-0.5 h-4 w-5 bg-foreground transition-all"
        style={{ left: isDark ? "calc(100% - 24px)" : "2px" }}
      />
    </button>
  );
}
