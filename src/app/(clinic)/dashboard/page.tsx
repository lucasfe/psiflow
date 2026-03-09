import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, Receipt, TrendingUp } from "lucide-react";
import { AppointmentStatus, InvoiceStatus } from "@/generated/prisma/enums";

async function getStats() {
  const [totalPatients, todayAppointments, pendingInvoices, monthRevenue] =
    await Promise.all([
      db.patient.count({ where: { active: true } }),
      db.appointment.count({
        where: {
          startsAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          status: { not: AppointmentStatus.CANCELLED },
        },
      }),
      db.invoice.count({ where: { status: InvoiceStatus.SENT } }),
      db.payment.aggregate({
        _sum: { amount: true },
        where: {
          paidAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

  return {
    totalPatients,
    todayAppointments,
    pendingInvoices,
    monthRevenue: Number(monthRevenue._sum.amount ?? 0),
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Patients"
          value={stats.totalPatients}
          icon={Users}
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={CalendarDays}
        />
        <StatCard
          title="Pending Invoices"
          value={stats.pendingInvoices}
          icon={Receipt}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthRevenue.toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/60 shadow-sm shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
