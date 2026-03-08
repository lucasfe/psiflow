import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { AppointmentStatus, AppointmentType } from "@/generated/prisma/enums";

const statusVariant: Record<AppointmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  SCHEDULED: "outline",
  CONFIRMED: "default",
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

const typeLabel: Record<AppointmentType, string> = {
  INITIAL_EVALUATION: "Initial Evaluation",
  FOLLOW_UP: "Follow-up",
  CRISIS: "Crisis",
  GROUP: "Group",
};

export default async function AppointmentsPage() {
  const appointments = await db.appointment.findMany({
    orderBy: { startsAt: "desc" },
    take: 50,
    include: {
      patient: { select: { firstName: true, lastName: true } },
      clinician: { select: { firstName: true, lastName: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground">Recent 50 appointments</p>
        </div>
        <a
          href="/appointments/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Schedule
        </a>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date & Time</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Clinician</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No appointments yet.
                </td>
              </tr>
            )}
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">
                    {appt.startsAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-muted-foreground">
                    {appt.startsAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    {" – "}
                    {appt.endsAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </td>
                <td className="px-4 py-3 font-medium">
                  {appt.patient.firstName} {appt.patient.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {appt.clinician.firstName} {appt.clinician.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{typeLabel[appt.type]}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[appt.status]}>
                    {appt.status.replace(/_/g, " ")}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
