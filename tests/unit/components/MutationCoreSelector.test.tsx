import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";

import { MutationCoreSelector } from "@/components/MutationCoreSelector";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key;
    t.has = () => false;
    return t;
  },
}));

describe("MutationCoreSelector", () => {
  it("未選択時は「変異付与可能」というテキストのみを表示する", () => {
    render(<MutationCoreSelector selectedEffectId={null} onSelect={vi.fn()} />);

    expect(screen.getByText("mutationCore.assignable")).toBeTruthy();
    expect(screen.queryByText("mutationCore.title")).toBeNull();
  });

  it("選択時は効果名とインフォメーションアイコンを表示する", () => {
    render(
      <MutationCoreSelector selectedEffectId="attack_boost_lv1" onSelect={vi.fn()} />,
    );

    expect(screen.queryByText("mutationCore.assignable")).toBeNull();
    expect(screen.getByRole("button", { name: /攻撃力/ })).toBeTruthy();
  });

  it("ダイアログのタイトルが変更されたメッセージになる", () => {
    render(<MutationCoreSelector selectedEffectId={null} onSelect={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "mutationCore.assignable" }));

    expect(screen.getByText("mutationCore.select")).toBeTruthy();
  });

  it("未選択時のボタンは左寄せで薄い紫背景・枠線なし、ホバーによる色変化がない", () => {
    render(<MutationCoreSelector selectedEffectId={null} onSelect={vi.fn()} />);

    const button = screen.getByRole("button", { name: "mutationCore.assignable" });
    expect(button.className).toContain("justify-start");
    expect(button.className).toContain("bg-purple-600/10");
    expect(button.className).not.toMatch(/border-2|border-purple/);
    expect(button.className).not.toMatch(/hover:bg-/);
  });

  it("選択時のボタンは左寄せで濃い紫背景、ホバーによる色変化がない", () => {
    render(<MutationCoreSelector selectedEffectId="attack_boost_lv1" onSelect={vi.fn()} />);

    const button = screen.getByRole("button", { name: /攻撃力/ });
    expect(button.className).toContain("justify-start");
    expect(button.className).toContain("bg-purple-600");
    expect(button.className).not.toContain("bg-purple-600/10");
    expect(button.className).not.toMatch(/hover:bg-/);
  });

  it("選択時のインフォメーションアイコンは白抜きになる", () => {
    render(<MutationCoreSelector selectedEffectId="attack_boost_lv1" onSelect={vi.fn()} />);

    const infoButton = screen.getByRole("button", { name: "info" });
    expect(infoButton.className).toContain("text-white");
  });

  it("モーダル内に「効果なし」の選択肢を表示しない", () => {
    render(<MutationCoreSelector selectedEffectId="attack_boost_lv1" onSelect={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /攻撃力/ }));

    expect(screen.queryByText("mutationCore.noEffect")).toBeNull();
  });

  it("除去ボタンを押すと変異効果の選択が解除され、モーダルが閉じる", () => {
    const onSelect = vi.fn();
    render(<MutationCoreSelector selectedEffectId="attack_boost_lv1" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /攻撃力/ }));
    fireEvent.click(screen.getByRole("button", { name: "外す" }));

    expect(onSelect).toHaveBeenCalledWith(null);
    expect(screen.queryByText("mutationCore.select")).toBeNull();
  });
});
