import * as React from "react";
import { useState } from "react";
import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";

import { Toggle } from "@/components/ui/toggle";

function ControlledToggle({ onPressedChange }: { onPressedChange?: (pressed: boolean) => void }) {
  const [pressed, setPressed] = useState(false);
  const handlePressedChange = (next: boolean) => {
    setPressed(next);
    onPressedChange?.(next);
  };

  return (
    <Toggle aria-label="通知" pressed={pressed} onPressedChange={handlePressedChange}>
      通知
    </Toggle>
  );
}

describe("Toggle (components/ui/toggle)", () => {
  it("buttonとしてARIA pressedと既定スタイルを適用する", () => {
    render(<Toggle aria-label="通知">通知</Toggle>);

    const toggle = screen.getByRole("button", { name: "通知" });
    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle.getAttribute("type")).toBe("button");
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(toggle.getAttribute("data-state")).toBe("off");
    expect(toggle.className).toContain("min-w-9");
  });

  it("defaultPressedで初期状態を設定し、クリックで切り替える", () => {
    render(
      <Toggle aria-label="通知" defaultPressed>
        通知
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "通知" });
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(toggle.getAttribute("data-state")).toBe("on");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(toggle.getAttribute("data-state")).toBe("off");
  });

  it("controlled stateをonPressedChangeで通知し、外部stateに従う", () => {
    const onPressedChange = vi.fn();
    render(<ControlledToggle onPressedChange={onPressedChange} />);

    const toggle = screen.getByRole("button", { name: "通知" });
    fireEvent.click(toggle);

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
  });

  it("disabledでは切り替えず、data-disabledを付与する", () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="通知" disabled onPressedChange={onPressedChange}>
        通知
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "通知" });
    expect(toggle.hasAttribute("data-disabled")).toBe(true);
    fireEvent.click(toggle);
    expect(onPressedChange).not.toHaveBeenCalled();
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
  });

  it("variant、size、classNameを合成しpressed状態のdata属性を付与する", () => {
    render(
      <Toggle aria-label="お気に入り" variant="outline" size="lg" pressed className="custom-class">
        ★
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "お気に入り" });
    expect(toggle.className).toContain("border-input");
    expect(toggle.className).toContain("h-10");
    expect(toggle.className).toContain("custom-class");
    expect(toggle.hasAttribute("data-pressed")).toBe(true);
    expect(toggle.getAttribute("data-state")).toBe("on");
  });

  it("refを標準button要素に転送し、キーボードイベントを維持する", () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onKeyDown = vi.fn();

    render(
      <Toggle ref={ref} aria-label="通知" onKeyDown={onKeyDown}>
        通知
      </Toggle>,
    );

    const toggle = screen.getByRole("button", { name: "通知" });
    expect(ref.current).toBe(toggle);
    fireEvent.keyDown(toggle, { key: " " });
    expect(onKeyDown).toHaveBeenCalledOnce();
  });
});
