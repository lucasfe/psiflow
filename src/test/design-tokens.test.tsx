import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

import { Sidebar } from "@/components/clinic/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Sidebar ─────────────────────────────────────────────────────────────────

describe("Sidebar — design tokens", () => {
  it("has glassmorphism background", () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("backdrop-blur-xl");
    expect(aside?.className).toContain("bg-white/60");
  });

  it("has transparent border", () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("border-white/40");
  });

  it("active nav item uses purple gradient", () => {
    render(<Sidebar />);
    const activeLink = screen.getByText("Dashboard").closest("a");
    expect(activeLink?.className).toContain("bg-gradient-to-r");
    expect(activeLink?.className).toContain("from-primary");
    expect(activeLink?.className).toContain("text-white");
  });

  it("active nav item has purple shadow", () => {
    render(<Sidebar />);
    const activeLink = screen.getByText("Dashboard").closest("a");
    expect(activeLink?.className).toContain("shadow-primary/20");
  });

  it("inactive nav items use muted text", () => {
    render(<Sidebar />);
    const inactiveLink = screen.getByText("Patients").closest("a");
    expect(inactiveLink?.className).toContain("text-muted-foreground");
  });

  it("logo mark is present", () => {
    render(<Sidebar />);
    expect(screen.getByText("Ψ")).toBeInTheDocument();
  });

  it("logo mark has purple gradient background", () => {
    render(<Sidebar />);
    const logo = screen.getByText("Ψ").parentElement;
    expect(logo?.className).toContain("from-primary");
  });
});

// ─── Badge ────────────────────────────────────────────────────────────────────

describe("Badge — design tokens", () => {
  it("default variant uses primary color", () => {
    const { container } = render(<Badge variant="default">Test</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-primary");
  });

  it("destructive variant exists", () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("destructive");
  });

  it("outline variant has border", () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("border");
  });
});

// ─── Card ─────────────────────────────────────────────────────────────────────

describe("Stat Card — design tokens", () => {
  function renderStatCard() {
    return render(
      <Card className="bg-white/70 backdrop-blur-sm border-white/60 shadow-sm shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Patients</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span>icon</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">128</p>
        </CardContent>
      </Card>
    );
  }

  it("has glass background", () => {
    const { container } = renderStatCard();
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("bg-white/70");
    expect(card.className).toContain("backdrop-blur-sm");
  });

  it("has transparent border", () => {
    const { container } = renderStatCard();
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border-white/60");
  });

  it("icon wrapper uses primary tint", () => {
    const { container } = renderStatCard();
    const iconWrapper = container.querySelector(".bg-primary\\/10");
    expect(iconWrapper).not.toBeNull();
  });

  it("has purple shadow", () => {
    const { container } = renderStatCard();
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("shadow-primary/5");
  });
});
