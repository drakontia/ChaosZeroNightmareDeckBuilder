import { useState } from "react";
import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function ControlledDropdownMenu({
  onOpenChange,
  onSelectA,
  asChildTrigger = true,
}: {
  onOpenChange?: (open: boolean) => void;
  onSelectA?: () => void;
  asChildTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      {asChildTrigger ? (
        <DropdownMenuTrigger asChild>
          <Button aria-label="開く">開く</Button>
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger>開く</DropdownMenuTrigger>
      )}
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>ラベル</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onSelectA?.()}>項目A</DropdownMenuItem>
        <DropdownMenuItem>項目B</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu (components/ui/dropdown-menu)", () => {
  it("初期状態ではメニューの内容は表示されない", () => {
    render(<ControlledDropdownMenu />);

    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.queryByText("項目A")).toBeNull();
  });

  it("トリガーをクリックすると開き、menu/menuitemロールと項目が表示される", () => {
    render(<ControlledDropdownMenu />);

    fireEvent.click(screen.getByRole("button", { name: "開く" }));

    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    expect(screen.getByText("項目A")).toBeTruthy();
    expect(screen.getByText("項目B")).toBeTruthy();
    expect(screen.getByText("ラベル")).toBeTruthy();
  });

  it("asChildを付けたトリガーは余分なラッパー要素を追加せず子要素をそのまま描画する", () => {
    render(<ControlledDropdownMenu asChildTrigger />);

    const trigger = screen.getByRole("button", { name: "開く" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.parentElement?.querySelectorAll("button").length).toBe(1);

    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("項目をクリックするとonClickが呼ばれ、メニューが閉じる", () => {
    const onOpenChange = vi.fn();
    const onSelectA = vi.fn();
    render(<ControlledDropdownMenu onOpenChange={onOpenChange} onSelectA={onSelectA} />);

    fireEvent.click(screen.getByRole("button", { name: "開く" }));
    fireEvent.click(screen.getByText("項目A"));

    expect(onSelectA).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("Escapeキーで閉じる", () => {
    const onOpenChange = vi.fn();
    render(<ControlledDropdownMenu onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole("button", { name: "開く" }));
    expect(screen.getByRole("menu")).toBeTruthy();

    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape", code: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
