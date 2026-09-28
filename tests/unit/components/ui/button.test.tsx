import * as React from "react";
import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

describe("Button (components/ui/button)", () => {
  it("標準のbutton要素に既定variantとsizeのスタイルを適用する", () => {
    render(<Button>決定</Button>);

    const button = screen.getByRole("button", { name: "決定" });
    expect(button.tagName).toBe("BUTTON");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("h-9");
  });

  it("variant、size、classNameを合成する", () => {
    render(
      <Button variant="outline" size="sm" className="custom-class">
        戻る
      </Button>,
    );

    const button = screen.getByRole("button", { name: "戻る" });
    expect(button.className).toContain("border-input");
    expect(button.className).toContain("h-8");
    expect(button.className).toContain("custom-class");
  });

  it("asChildでは追加のbuttonを作らず子要素にButtonのpropsとスタイルを渡す", () => {
    const onButtonClick = vi.fn();
    const onChildClick = vi.fn();

    render(
      <Button asChild variant="secondary" onClick={onButtonClick}>
        <a href="/deck" className="child-class" aria-label="デッキ" onClick={onChildClick}>
          デッキ
        </a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "デッキ" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/deck");
    expect(link.getAttribute("type")).toBeNull();
    expect(link.className).toContain("child-class");
    expect(link.className).toContain("bg-secondary");
    expect(screen.queryByRole("button")).toBeNull();

    fireEvent.click(link);
    expect(onButtonClick).toHaveBeenCalledOnce();
    expect(onChildClick).toHaveBeenCalledOnce();
  });

  it("asChildのbutton子要素にもクラスとイベントを合成する", () => {
    const onButtonClick = vi.fn();
    const onChildClick = vi.fn();

    render(
      <Button asChild variant="outline" onClick={onButtonClick}>
        <button className="child-class" onClick={onChildClick}>
          適用
        </button>
      </Button>,
    );

    const button = screen.getByRole("button", { name: "適用" });
    expect(button.tagName).toBe("BUTTON");
    expect(button.className).toContain("child-class");
    expect(button.className).toContain("border-input");

    fireEvent.click(button);
    expect(onButtonClick).toHaveBeenCalledOnce();
    expect(onChildClick).toHaveBeenCalledOnce();
  });

  it("refとdisabled状態を標準buttonに反映する", () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Button ref={ref} disabled onClick={onClick}>
        無効
      </Button>,
    );

    const button = screen.getByRole("button", { name: "無効" });
    expect(ref.current).toBe(button);
    expect(button.hasAttribute("disabled")).toBe(true);

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("ButtonGroup (components/ui/button-group)", () => {
  it("group roleとorientation属性を保つ", () => {
    render(
      <ButtonGroup orientation="vertical" aria-label="カード操作">
        <Button>編集</Button>
        <Button>削除</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole("group", { name: "カード操作" });
    expect(group.getAttribute("data-slot")).toBe("button-group");
    expect(group.getAttribute("data-orientation")).toBe("vertical");
    expect(group.className).toContain("flex-col");
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("ButtonGroupTextのasChildで子要素をそのまま描画する", () => {
    render(
      <ButtonGroupText asChild>
        <span data-testid="group-label" className="label-class">
          フィルター
        </span>
      </ButtonGroupText>,
    );

    const label = screen.getByTestId("group-label");
    expect(label.tagName).toBe("SPAN");
    expect(label.className).toContain("bg-muted");
    expect(label.className).toContain("label-class");
  });
});
