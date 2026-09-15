import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("結合した文字列を返す", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("falsyな値を無視する", () => {
    expect(cn("px-2", false && "py-1", null, undefined, "text-white")).toBe(
      "px-2 text-white",
    );
  });

  it("オブジェクト形式の条件付きクラスを扱える", () => {
    expect(cn("px-2", { "bg-blue-500": true, "bg-red-500": false })).toBe(
      "px-2 bg-blue-500",
    );
  });

  it("競合するTailwindクラスを後勝ちでマージする", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
