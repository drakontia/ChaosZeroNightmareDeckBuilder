"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive> & {
  decorative?: boolean;
};

const Separator = React.forwardRef<
  HTMLDivElement,
  SeparatorProps
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    orientation={orientation}
    role={decorative ? "none" : "separator"}
    aria-orientation={!decorative && orientation === "vertical" ? "vertical" : undefined}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.displayName;

export { Separator };
