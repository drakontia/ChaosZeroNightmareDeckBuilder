import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";

import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function ControlledPopover({
  onOpenChange,
  asChild = false,
  iconTrigger = false,
}: {
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
  iconTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {asChild ? (
        <PopoverTrigger asChild>
          {iconTrigger ? (
            <svg aria-label="詳細を開く" data-testid="icon-trigger" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" />
            </svg>
          ) : (
            <button type="button" aria-label="詳細を開く">
              開く
            </button>
          )}
        </PopoverTrigger>
      ) : (
        <PopoverTrigger>開く</PopoverTrigger>
      )}
      <PopoverContent className="custom-popover" side="right" align="start">
        <p>ポップオーバーの内容</p>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover (components/ui/popover)", () => {
  it("トリガーを押すと内容を表示し、閉じる操作を onOpenChange に通知する", () => {
    const onOpenChange = vi.fn();
    render(<ControlledPopover onOpenChange={onOpenChange} />);

    expect(screen.queryByText("ポップオーバーの内容")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "開く" }));

    expect(screen.getByText("ポップオーバーの内容")).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.keyDown(screen.getByText("ポップオーバーの内容"), {
      key: "Escape",
      code: "Escape",
    });

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByText("ポップオーバーの内容")).toBeNull();
  });

  it("asChild のボタントリガーは余分なボタンを作らず、その子要素で開く", () => {
    render(<ControlledPopover asChild />);

    const trigger = screen.getByRole("button", { name: "詳細を開く" });
    expect(trigger.parentElement?.querySelectorAll("button")).toHaveLength(1);

    fireEvent.click(trigger);

    expect(screen.getByText("ポップオーバーの内容")).toBeTruthy();
  });

  it("asChild の非ボタン要素もキーボード操作可能なトリガーとして描画する", () => {
    render(<ControlledPopover asChild iconTrigger />);

    const trigger = screen.getByRole("button", { name: "詳細を開く" });
    expect(trigger).toBe(screen.getByTestId("icon-trigger"));
    expect(trigger.tagName.toLowerCase()).toBe("svg");

    fireEvent.click(trigger);

    expect(screen.getByText("ポップオーバーの内容")).toBeTruthy();
  });

  it("コンテンツのクラスと side/align の配置指定を受け付ける", () => {
    render(<ControlledPopover />);
    fireEvent.click(screen.getByRole("button", { name: "開く" }));

    const content = document.querySelector(".custom-popover");
    expect(content?.className).toContain("custom-popover");
    expect(content?.getAttribute("data-side")).toBe("right");
    expect(content?.getAttribute("data-align")).toBe("start");
  });

  it("PopoverAnchor の named export を利用できる", () => {
    expect(PopoverAnchor).toBeDefined();
  });
});
