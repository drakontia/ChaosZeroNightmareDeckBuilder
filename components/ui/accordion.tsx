"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionRootProps = Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue"> &
  (
    | {
        type: "single";
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        collapsible?: boolean;
      }
    | {
        type: "multiple";
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  ) & {
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
  };

const Accordion = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  function Accordion(props, ref) {
    if (props.type === "single") {
      const { type, value, defaultValue, onValueChange, collapsible = false, ...rootProps } = props;

      return (
        <AccordionPrimitive.Root
          ref={ref}
          data-accordion-root=""
          multiple={false}
          value={value === undefined ? undefined : value === "" ? [] : [value]}
          defaultValue={
            defaultValue === undefined ? undefined : defaultValue === "" ? [] : [defaultValue]
          }
          onValueChange={(nextValue, eventDetails) => {
            if (nextValue.length === 0 && !collapsible) {
              eventDetails.cancel();
              return;
            }
            onValueChange?.(nextValue[0] ?? "");
          }}
          {...rootProps}
        />
      );
    }

    const { type, value, defaultValue, onValueChange, ...rootProps } = props;
    return (
      <AccordionPrimitive.Root
        ref={ref}
        data-accordion-root=""
        multiple
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        {...rootProps}
      />
    );
  },
);
Accordion.displayName = "Accordion";

type AccordionItemProps = React.ComponentPropsWithoutRef<"div"> & {
  value: string;
  disabled?: boolean;
};

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn("border-b", className)}
      render={(elementProps, state) => (
        <div {...elementProps} data-state={state.open ? "open" : "closed"} />
      )}
      {...props}
    />
  ),
);
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps = React.ComponentPropsWithoutRef<"button">;

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const root = event.currentTarget.closest<HTMLElement>("[data-accordion-root]");
      if (!root) return;

      const orientation = root.getAttribute("data-orientation") ?? "vertical";
      const isRtl = root.dir === "rtl" || root.getAttribute("dir") === "rtl";
      let direction = 0;
      if (orientation === "vertical" && event.key === "ArrowDown") direction = 1;
      if (orientation === "vertical" && event.key === "ArrowUp") direction = -1;
      if (orientation === "horizontal" && event.key === (isRtl ? "ArrowLeft" : "ArrowRight")) {
        direction = 1;
      }
      if (orientation === "horizontal" && event.key === (isRtl ? "ArrowRight" : "ArrowLeft")) {
        direction = -1;
      }

      const triggers = Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]"),
      ).filter(
        (trigger) =>
          trigger.closest("[data-accordion-root]") === root &&
          !trigger.disabled &&
          trigger.getAttribute("aria-disabled") !== "true",
      );
      const currentIndex = triggers.indexOf(event.currentTarget);
      let nextIndex = currentIndex;
      if (direction !== 0 && currentIndex !== -1) {
        nextIndex = (currentIndex + direction + triggers.length) % triggers.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = triggers.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      triggers[nextIndex]?.focus();
    };

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
            className,
          )}
          render={(elementProps, state) => (
            <button
              {...elementProps}
              data-accordion-trigger=""
              data-state={state.open ? "open" : "closed"}
            />
          )}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

type AccordionContentProps = React.ComponentPropsWithoutRef<"div"> & {
  forceMount?: boolean;
};

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, forceMount, ...props }, ref) => (
    <AccordionPrimitive.Panel
      ref={ref}
      keepMounted={forceMount}
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      render={(elementProps, state) => (
        <div {...elementProps} data-state={state.open ? "open" : "closed"} />
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  ),
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
