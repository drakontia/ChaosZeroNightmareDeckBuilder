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
});
