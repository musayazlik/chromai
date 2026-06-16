"use client";

import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t.actions.theme}
      // resolvedTheme is read in the handler (client-only), so there's no
      // hydration mismatch; the icon itself is swapped purely via the .dark class.
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-xl text-text-dim hover:bg-foreground/6 hover:text-text"
    >
      <Icon
        icon="lucide:sun"
        width={18}
        height={18}
        className="hidden dark:block"
      />
      <Icon
        icon="lucide:moon"
        width={18}
        height={18}
        className="block dark:hidden"
      />
    </Button>
  );
}
