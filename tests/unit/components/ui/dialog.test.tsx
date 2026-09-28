import { useState } from "react";
import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const messages = {
  common: {
    close: "閉じる",
  },
};

function renderWithIntl(children: React.ReactNode) {
  return render(
    <NextIntlClientProvider
      locale="ja"
      messages={messages}
      onError={() => {}}
      getMessageFallback={({ key }) => key}
    >
      {children}
    </NextIntlClientProvider>,
  );
}

function ControlledDialog({
  onOpenChange,
  asChildTrigger = false,
}: {
  onOpenChange?: (open: boolean) => void;
  asChildTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {asChildTrigger ? (
        <DialogTrigger asChild>
          <Button aria-label="開く">開く</Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger>開く</DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タイトル</DialogTitle>
          <DialogDescription>説明文</DialogDescription>
        </DialogHeader>
        <p>本文</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">フッターで閉じる</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog (components/ui/dialog)", () => {
  it("初期状態ではダイアログの内容は表示されない", () => {
    renderWithIntl(<ControlledDialog />);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText("タイトル")).toBeNull();
  });

  it("トリガーをクリックすると開き、タイトル・説明文・本文が表示される", () => {
    renderWithIntl(<ControlledDialog />);

    fireEvent.click(screen.getByRole("button", { name: "開く" }));

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("タイトル")).toBeTruthy();
    expect(screen.getByText("説明文")).toBeTruthy();
    expect(screen.getByText("本文")).toBeTruthy();
  });

  it("asChildを付けたトリガーは余分なラッパー要素を追加せず子要素をそのまま描画する", () => {
    renderWithIntl(<ControlledDialog asChildTrigger />);

    const trigger = screen.getByRole("button", { name: "開く" });
    // asChild の場合、子要素 (Button) がそのままトリガーになり、
    // 二重にボタンでラップされないこと。
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.parentElement?.querySelectorAll("button").length).toBe(1);

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("組み込みの閉じるボタン(X)をクリックすると onOpenChange(false) が呼ばれ、内容が消える", () => {
    const onOpenChange = vi.fn();
    renderWithIntl(<ControlledDialog onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole("button", { name: "開く" }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("DialogClose(asChild)のフッターボタンをクリックすると閉じる", () => {
    const onOpenChange = vi.fn();
    renderWithIntl(<ControlledDialog onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole("button", { name: "開く" }));
    fireEvent.click(screen.getByRole("button", { name: "フッターで閉じる" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Escapeキーで閉じる", () => {
    const onOpenChange = vi.fn();
    renderWithIntl(<ControlledDialog onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByRole("button", { name: "開く" }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape", code: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
