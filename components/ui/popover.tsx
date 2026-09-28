"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

interface PopoverAnchorContextValue {
  anchor: HTMLElement | null;
  setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const PopoverAnchorContext = React.createContext<PopoverAnchorContextValue | null>(null);

type PopoverProps = Omit<React.ComponentProps<typeof PopoverPrimitive.Root>, "children"> & {
  children?: React.ReactNode;
};

function Popover({ children, ...props }: PopoverProps) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const anchorContext = React.useMemo(() => ({ anchor, setAnchor }), [anchor]);

  return (
    <PopoverAnchorContext.Provider value={anchorContext}>
      <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
    </PopoverAnchorContext.Provider>
  );
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
  asChild?: boolean;
};

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, children, nativeButton, render, ...props }, ref) => {
    const trigger = asChild && React.isValidElement(children) ? children : render;
    const isNonButtonElement =
      React.isValidElement(trigger) &&
      typeof trigger.type === "string" &&
      trigger.type !== "button";
    const triggerProps = {
      ...props,
      nativeButton: nativeButton ?? !isNonButtonElement,
      ref,
      render: trigger,
    };

    if (asChild && React.isValidElement(children)) {
      return <PopoverPrimitive.Trigger {...triggerProps} />;
    }

    return <PopoverPrimitive.Trigger {...triggerProps}>{children}</PopoverPrimitive.Trigger>;
  },
);
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverAnchor = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  (props, forwardedRef) => {
    const setAnchor = React.useContext(PopoverAnchorContext)?.setAnchor;

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (setAnchor) {
          setAnchor(node);
        }
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef, setAnchor],
    );

    return <div ref={setRefs} {...props} />;
  },
);
PopoverAnchor.displayName = "PopoverAnchor";

type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Positioner>,
    "side" | "align" | "sideOffset"
  >;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Popup>,
  PopoverContentProps
>(({ className, align = "center", side = "bottom", sideOffset = 4, ...props }, ref) => {
  const anchor = React.useContext(PopoverAnchorContext)?.anchor;

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        anchor={anchor ?? undefined}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={cn(
            "w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[var(--transform-origin)]",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
