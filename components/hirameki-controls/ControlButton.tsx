import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ControlButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
}

const toggleIconButtonClass =
  "inline-flex items-center justify-center h-6 xl:h-9 w-6 xl:w-9 rounded-full transition";

export function ControlButton({
  active,
  label,
  onClick,
  activeIcon,
  inactiveIcon,
}: ControlButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        toggleIconButtonClass,
        active
          ? "bg-yellow-400 text-black hover:bg-yellow-400/90"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      )}
    >
      {active ? activeIcon : inactiveIcon}
    </Button>
  );
}
