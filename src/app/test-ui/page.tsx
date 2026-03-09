import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/clinic/sidebar";
import { Users, CalendarDays, Receipt, TrendingUp } from "lucide-react";

// Only available in non-production environments
export default function TestUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8 space-y-10">

        {/* Typography */}
        <section data-testid="section-typography">
          <h1 className="text-3xl font-bold mb-1">Heading 1 — Inter Bold</h1>
          <h2 className="text-2xl font-semibold mb-1">Heading 2 — Semibold</h2>
          <h3 className="text-xl font-medium mb-1">Heading 3 — Medium</h3>
          <p className="text-base text-foreground mb-1">Body text — regular weight, full foreground</p>
          <p className="text-sm text-muted-foreground">Small muted text — captions, labels</p>
        </section>

        {/* Colors */}
        <section data-testid="section-colors">
          <h2 className="text-lg font-semibold mb-3">Color Palette</h2>
          <div className="flex flex-wrap gap-3">
            <div className="h-12 w-24 rounded-lg bg-primary flex items-end p-1"><span className="text-xs text-primary-foreground font-medium">primary</span></div>
            <div className="h-12 w-24 rounded-lg bg-secondary flex items-end p-1"><span className="text-xs text-secondary-foreground font-medium">secondary</span></div>
            <div className="h-12 w-24 rounded-lg bg-accent flex items-end p-1"><span className="text-xs text-accent-foreground font-medium">accent</span></div>
            <div className="h-12 w-24 rounded-lg bg-muted flex items-end p-1"><span className="text-xs text-muted-foreground font-medium">muted</span></div>
            <div className="h-12 w-24 rounded-lg bg-destructive flex items-end p-1"><span className="text-xs text-destructive-foreground font-medium">destructive</span></div>
            <div className="h-12 w-24 rounded-lg border border-border flex items-end p-1"><span className="text-xs text-foreground font-medium">border</span></div>
          </div>
        </section>

        {/* Stat Cards */}
        <section data-testid="section-cards">
          <h2 className="text-lg font-semibold mb-3">Stat Cards</h2>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Active Patients", value: "128", icon: Users },
              { title: "Today's Appointments", value: "12", icon: CalendarDays },
              { title: "Pending Invoices", value: "7", icon: Receipt },
              { title: "Monthly Revenue", value: "$9,400", icon: TrendingUp },
            ].map(({ title, value, icon: Icon }) => (
              <Card key={title} className="bg-white/70 backdrop-blur-sm border-white/60 shadow-sm shadow-primary/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section data-testid="section-badges">
          <h2 className="text-lg font-semibold mb-3">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        {/* Buttons */}
        <section data-testid="section-buttons">
          <h2 className="text-lg font-semibold mb-3">Buttons</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

      </div>
    </div>
  );
}
