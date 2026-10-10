import { describe, expect, it } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import * as React from "react";

import { Separator } from "@/components/ui/separator";

describe("Separator (components/ui/separator)", () => {
  it("renders a decorative horizontal separator by default with its existing dimensions", () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId("separator");

    expect(separator.getAttribute("role")).toBe("none");
    expect(separator.getAttribute("data-orientation")).toBe("horizontal");
    expect(separator.getAttribute("aria-orientation")).toBeNull();
    expect(separator.className).toContain("h-[1px]");
    expect(separator.className).toContain("w-full");
  });

  it("exposes a horizontal separator to assistive technology when it is not decorative", () => {
    render(<Separator decorative={false} />);

    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("data-orientation")).toBe("horizontal");
    expect(separator.getAttribute("aria-orientation")).toBeNull();
  });

  it("preserves vertical orientation semantics and dimensions", () => {
    render(<Separator decorative={false} orientation="vertical" />);

    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("data-orientation")).toBe("vertical");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    expect(separator.className).toContain("h-full");
    expect(separator.className).toContain("w-[1px]");
  });

  it("keeps vertical decorative separators hidden from assistive technology", () => {
    render(<Separator data-testid="decorative-separator" orientation="vertical" />);
    const separator = screen.getByTestId("decorative-separator");

    expect(separator.getAttribute("role")).toBe("none");
    expect(separator.getAttribute("aria-orientation")).toBeNull();
  });

  it("forwards HTML props and refs", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} id="divider" aria-label="区切り" decorative={false} />);

    expect(ref.current).toBe(screen.getByRole("separator", { name: "区切り" }));
    expect(ref.current?.id).toBe("divider");
  });
});
