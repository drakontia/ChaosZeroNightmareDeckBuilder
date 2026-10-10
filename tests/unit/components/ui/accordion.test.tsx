import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

describe("Accordion", () => {
  it("preserves refs, forwarded props, accessibility attributes, and styling", () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Accordion
        ref={rootRef}
        type="single"
        defaultValue="first"
        data-testid="accordion"
        aria-label="Card categories"
      >
        <AccordionItem ref={itemRef} value="first" data-testid="item">
          <AccordionTrigger ref={triggerRef} data-testid="trigger">
            First category
          </AccordionTrigger>
          <AccordionContent ref={contentRef} className="custom-content">
            First panel
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const root = screen.getByTestId("accordion");
    const item = screen.getByTestId("item");
    const trigger = screen.getByTestId("trigger");
    const panel = screen.getByRole("region");

    expect(rootRef.current).toBe(root);
    expect(itemRef.current).toBe(item);
    expect(triggerRef.current).toBe(trigger);
    expect(contentRef.current).toBe(panel);
    expect(root.getAttribute("aria-label")).toBe("Card categories");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id);
    expect(trigger.getAttribute("data-state")).toBe("open");
    expect(panel.getAttribute("data-state")).toBe("open");
    expect(item.className).toContain("border-b");
    expect(trigger.className).toContain("py-4");
    expect(trigger.className).toContain("text-sm");
    expect(trigger.className).toContain("font-medium");
    expect(panel.firstElementChild?.className).toContain("pb-4");
    expect(panel.firstElementChild?.className).toContain("pt-0");
    expect(panel.firstElementChild?.className).toContain("custom-content");
  });

  it("supports controlled single and multiple values", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Accordion type="single" value="first" onValueChange={onValueChange}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First panel</AccordionContent>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Second panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(onValueChange).toHaveBeenCalledWith("second");
    expect(screen.getByRole("button", { name: "First" }).getAttribute("aria-expanded")).toBe(
      "true",
    );

    rerender(
      <Accordion type="single" value="second" onValueChange={onValueChange}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First panel</AccordionContent>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Second panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("button", { name: "Second" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("keeps single items open unless collapsible is enabled", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Accordion type="single" defaultValue="first" onValueChange={onValueChange}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "First" });
    fireEvent.click(trigger);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    rerender(
      <Accordion type="single" defaultValue="first" collapsible onValueChange={onValueChange}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(trigger);
    expect(onValueChange).toHaveBeenCalledWith("");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps multiple panels open and supports keyboard navigation", () => {
    render(
      <Accordion type="multiple" defaultValue={["first"]}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First panel</AccordionContent>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Second panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const firstTrigger = screen.getByRole("button", { name: "First" });
    const secondTrigger = screen.getByRole("button", { name: "Second" });
    fireEvent.keyDown(firstTrigger, { key: "ArrowDown" });
    expect(document.activeElement).toBe(secondTrigger);
    fireEvent.click(secondTrigger);

    expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(secondTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getAllByRole("region")).toHaveLength(2);
  });

  it.each([
    { orientation: "vertical" as const, dir: "ltr", nextKey: "ArrowDown", previousKey: "ArrowUp" },
    {
      orientation: "horizontal" as const,
      dir: "ltr",
      nextKey: "ArrowRight",
      previousKey: "ArrowLeft",
    },
    {
      orientation: "horizontal" as const,
      dir: "rtl",
      nextKey: "ArrowLeft",
      previousKey: "ArrowRight",
    },
  ])(
    "navigates $orientation items in $dir order with wrapping, Home and End",
    ({ orientation, dir, nextKey, previousKey }) => {
      render(
        <Accordion type="multiple" orientation={orientation} dir={dir}>
          <AccordionItem value="first">
            <AccordionTrigger>First</AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="disabled" disabled>
            <AccordionTrigger>Disabled</AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="last">
            <AccordionTrigger>Last</AccordionTrigger>
          </AccordionItem>
        </Accordion>,
      );

      const first = screen.getByRole("button", { name: "First" });
      const last = screen.getByRole("button", { name: "Last" });
      first.focus();
      fireEvent.keyDown(first, { key: nextKey });
      expect(document.activeElement).toBe(last);
      fireEvent.keyDown(last, { key: nextKey });
      expect(document.activeElement).toBe(first);
      fireEvent.keyDown(first, { key: previousKey });
      expect(document.activeElement).toBe(last);
      fireEvent.keyDown(last, { key: "Home" });
      expect(document.activeElement).toBe(first);
      fireEvent.keyDown(first, { key: "End" });
      expect(document.activeElement).toBe(last);
      fireEvent.keyDown(last, { key: "a" });
      expect(document.activeElement).toBe(last);
    },
  );

  it("respects a caller preventing keyboard navigation", () => {
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });
    render(
      <Accordion type="multiple">
        <AccordionItem value="first">
          <AccordionTrigger onKeyDown={onKeyDown}>First</AccordionTrigger>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionTrigger>Second</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    );
    const first = screen.getByRole("button", { name: "First" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(first);
  });

  it("supports an empty controlled single value and mounted closed content", () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" value="" collapsible onValueChange={onValueChange}>
        <AccordionItem value="first">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent forceMount>First panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("First panel").parentElement?.getAttribute("data-state")).toBe(
      "closed",
    );
    fireEvent.click(trigger);
    expect(onValueChange).toHaveBeenCalledWith("first");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
