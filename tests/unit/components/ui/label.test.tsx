import { createRef } from "react";
import { describe, expect, it } from "vite-plus/test";
import { render, screen } from "@testing-library/react";

import { FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

describe("Label (components/ui/label)", () => {
  it("renders label styles and forwards standard, style, and ARIA props", () => {
    render(
      <Label
        aria-label="表示名"
        data-testid="label"
        htmlFor="display-name"
        style={{ color: "red" }}
        className="custom-label"
      >
        表示名
      </Label>,
    );

    const label = screen.getByTestId("label");
    expect(label.tagName).toBe("LABEL");
    expect(label.getAttribute("for")).toBe("display-name");
    expect(label.getAttribute("aria-label")).toBe("表示名");
    expect(label.classList.contains("text-sm")).toBe(true);
    expect(label.classList.contains("font-medium")).toBe(true);
    expect(label.classList.contains("custom-label")).toBe(true);
    expect(label.style.color).toBe("red");
  });

  it("associates a label with its form control and forwards its ref", () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <>
        <Label ref={ref} htmlFor="display-name">
          表示名
        </Label>
        <input id="display-name" />
      </>,
    );

    const label = screen.getByText("表示名");
    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(ref.current).toBe(label);
    expect(input.labels?.item(0)).toBe(label);
  });

  it("keeps FieldLabel styling and label association", () => {
    render(
      <>
        <FieldLabel data-testid="field-label" htmlFor="player-name">
          プレイヤー名
        </FieldLabel>
        <input id="player-name" />
      </>,
    );

    const label = screen.getByTestId("field-label");
    expect(label.tagName).toBe("LABEL");
    expect(label.getAttribute("data-slot")).toBe("field-label");
    expect(label.getAttribute("for")).toBe("player-name");
    expect(label.classList.contains("peer/field-label")).toBe(true);
    expect(label.classList.contains("flex")).toBe(true);
  });
});
