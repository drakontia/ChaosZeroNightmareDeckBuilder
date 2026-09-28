import { useState } from "react";
import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";

import { Switch } from "@/components/ui/switch";

function ControlledSwitch({ onCheckedChange }: { onCheckedChange?: (checked: boolean) => void }) {
  const [checked, setChecked] = useState(false);
  const handleCheckedChange = (next: boolean) => {
    setChecked(next);
    onCheckedChange?.(next);
  };

  return <Switch aria-label="通知" checked={checked} onCheckedChange={handleCheckedChange} />;
}

describe("Switch (components/ui/switch)", () => {
  it("初期状態ではオフ(unchecked)で描画される", () => {
    render(<Switch aria-label="通知" defaultChecked={false} />);

    const el = screen.getByRole("switch", { name: "通知" });
    expect(el.getAttribute("aria-checked")).toBe("false");
  });

  it("defaultCheckedを指定するとオン(checked)で描画される(uncontrolled)", () => {
    render(<Switch aria-label="通知" defaultChecked />);

    const el = screen.getByRole("switch", { name: "通知" });
    expect(el.getAttribute("aria-checked")).toBe("true");
  });

  it("uncontrolledでクリックするとオン/オフが切り替わる", () => {
    render(<Switch aria-label="通知" defaultChecked={false} />);

    const el = screen.getByRole("switch", { name: "通知" });
    expect(el.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(el);
    expect(el.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(el);
    expect(el.getAttribute("aria-checked")).toBe("false");
  });

  it("controlledでクリックするとonCheckedChangeが呼ばれ、外部stateに応じて表示が更新される", () => {
    const onCheckedChange = vi.fn();
    render(<ControlledSwitch onCheckedChange={onCheckedChange} />);

    const el = screen.getByRole("switch", { name: "通知" });
    expect(el.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(el);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(el.getAttribute("aria-checked")).toBe("true");
  });

  it("disabledの場合はクリックしても状態が変化せず、onCheckedChangeも呼ばれない", () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="通知"
        defaultChecked={false}
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const el = screen.getByRole("switch", { name: "通知" });
    fireEvent.click(el);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(el.getAttribute("aria-checked")).toBe("false");
  });

  it("checked状態ではdata-checked属性、unchecked状態ではdata-unchecked属性が付与される", () => {
    const { rerender } = render(<Switch aria-label="通知" checked={false} />);
    const el = screen.getByRole("switch", { name: "通知" });

    expect(el.hasAttribute("data-unchecked")).toBe(true);
    expect(el.hasAttribute("data-checked")).toBe(false);

    rerender(<Switch aria-label="通知" checked />);
    expect(el.hasAttribute("data-checked")).toBe(true);
    expect(el.hasAttribute("data-unchecked")).toBe(false);
  });

  it("disabledの場合はdata-disabled属性が付与される", () => {
    render(<Switch aria-label="通知" disabled />);
    const el = screen.getByRole("switch", { name: "通知" });

    expect(el.hasAttribute("data-disabled")).toBe(true);
  });
});
