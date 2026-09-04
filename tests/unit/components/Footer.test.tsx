import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";

vi.mock("next/link", () => ({
  default: ({ href, children, target, rel, ...props }: any) => (
    <a href={href} target={target} rel={rel} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, width, height, className }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-testid="footer-image"
    />
  ),
}));

describe("Footer", () => {
  it("GitHubロゴの src が先頭スラッシュ付きで設定されている", () => {
    render(<Footer />);
    const img = screen.getByTestId("footer-image");
    expect(img.getAttribute("src")).toBe("/images/GitHub_Invertocat_Black_Clearspace.png");
  });

  it("GitHubロゴの width が 24 である", () => {
    render(<Footer />);
    const img = screen.getByTestId("footer-image");
    expect(Number(img.getAttribute("width"))).toBe(24);
  });

  it("GitHubロゴの height が 24 である", () => {
    render(<Footer />);
    const img = screen.getByTestId("footer-image");
    expect(Number(img.getAttribute("height"))).toBe(24);
  });

  it("コピーライト表記が表示される", () => {
    render(<Footer />);
    expect(screen.getByText(/ChaosZeroNightmare Deck Builder/)).toBeTruthy();
  });
});
